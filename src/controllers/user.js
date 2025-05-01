import bcrypt from "bcryptjs";
import { userModel } from "../models/index.js";
import { arrayToObject, transformQueryToFilterObject } from "../utils/index.js";

const allowedUpdateUser = ["admin"];

//[GET] /users
export const getAllUsers = async (req, res, next) => {
  try {
    const filterObj = transformQueryToFilterObject(req.query);

    const [rows, pager] = await userModel.find(filterObj, req.pager, req.order);

    const refs = {};
    const userIds = rows.reduce((row) => [row.createdBy, row.lastUpdatedBy]).filter(Boolean);
    if (userIds.length > 0) {
      const users = await userModel.findManyById(userIds);
      refs.users = arrayToObject(users);
    }

    res.status(201).json({ users: rows, pager, refs });
  } catch (error) {
    next(error);
  }
};

//[GET] /users/:role
export const getUsersWithRole = async (req, res, next) => {
  const { role } = req.params;

  try {
    const filterObj = transformQueryToFilterObject(req.query);
    filterObj.role = role;
    const [rows, pager] = await userModel.find(filterObj, req.pager, req.order);

    const refs = {};
    const promises = [null, null, null];
    const userIds = rows.reduce((row) => [row.createdBy, row.lastUpdatedBy]).filter(Boolean);
    if (userIds.length > 0) {
      promises[0] = userModel.findManyById(userIds);
    }

    if (["teacher", "consultant", "finance-officer"].includes(role)) {
      // promises[1] = find employment by userId;
    }

    if (role === "teacher") {
      // get class
      // promises[2] = find class by userIds = teacher_id;
    }

    if (role === "student") {
      // get class
      // promises[2] = find class by userIds student_id;
    }

    res.status(201).json({ users: rows, pager, refs });
  } catch (error) {
    next(error);
  }
};

//[POST] /users/sign-up
export const signUp = async (req, res, next) => {
  try {
    const { role, ...data } = req.body;
    const { email } = data;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;

    if (allowedUpdateUser.includes(req.userRole)) data.role = role;
    await userModel.create(data);
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    next(error);
  }
};

//[POST] /users/
export const createUser = async (req, res, next) => {
  try {
    const { role, ...data } = req.body;
    const { email } = data;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;
    data.created_by = req.userId;

    if (allowedUpdateUser.includes(req.userRole)) data.role = role;
    await userModel.create(data);
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    next(error);
  }
};

//[POST] /users/:role
export const createUserWithRole = async (req, res, next) => {
  const { role } = req.params;

  try {
    const { role, ...data } = req.body;
    const { email } = data;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;
    data.created_by = req.userId;

    if (allowedUpdateUser.includes(req.userRole)) data.role = role;
    await userModel.create(data);
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    next(error);
  }
};

//[GET] /users/:id
export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

//[GET] /users/:id
export const getUserByIdWithRole = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

//[DELETE] /users/:id
export const deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    await userModel.delete(id);
    res.status(201).json({ message: "Xóa thành công!" });
  } catch (error) {
    next(error);
  }
};

//[PATCH] /users/:id
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!allowedUpdateUser.includes(req.userRole) && req.userId != id) {
      res.status(403).json({ message: "Quyền truy cập bị từ chối" });
      return;
    }

    // remove password, role, oid
    const { password, role, id: oid, ...data } = req.body;

    if (allowedUpdateUser.includes(req.userRole)) {
      data.role = role;
      if (password) data.password = await bcrypt.hash(data.password, 12);
    }

    data.last_updated_at = new Date();
    data.last_updated_by = req.userId;
    const updatedUser = await userModel.updateById(id, data);
    res.status(201).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};

//[GET] /users/check-email/:email
export const checkUserByEMail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const exists = await userModel.exists({ email });
    res.status(201).json({ exists });
  } catch (error) {
    next(error);
  }
};

//[POST] /users/compare-password
export const compareUserPassword = async (req, res, next) => {};

//[GET] /users/forgot-password/:email
export const forgotPassword = async (req, res, next) => {};

//[GET] /users/verify-reset-password-code/:email/:code
export const verifyResetPasswordCode = async (req, res, next) => {};

//[PATCH] /users/reset-password/:email
export const resetPassword = async (req, res, next) => {};
