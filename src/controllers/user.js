import bcrypt from "bcryptjs";
import { employeeModel, userModel } from "../models/index.js";
import { arrayToObject, transformQueryToFilterObject } from "../utils/index.js";
import { EMPLOYEE_ROLES } from "../constants/index.js";

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
    if (role !== "_") filterObj.role = role;

    const [rows, pager] = await userModel.find(filterObj, req.pager, req.order);

    const refs = {};
    const promises = [null, null, null];
    const userIds = rows.map((row) => [row.createdBy, row.lastUpdatedBy]).filter(Boolean);
    if (userIds.length > 0) {
      promises[0] = userModel.findManyById(userIds);
    }

    if (EMPLOYEE_ROLES.includes(role)) {
      // promises[1] = find employment by userId;
      const userIds = rows.map((u) => u.id);
      promises[1] = employeeModel.find({ userId: { any: userIds } });
    }

    if (role === "teacher") {
      // get class
      // promises[2] = find class by userIds = teacher_id;
    }

    if (role === "student") {
      // get class
      // promises[2] = find class by userIds student_id;
    }

    const [creators, employeeResult] = await Promise.all(promises);
    refs.creators = arrayToObject(creators, "id");
    if (employeeResult) {
      refs.userEmployees = arrayToObject(employeeResult[0], "userId");
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
    const { role, employmentType, certificates, major, startDate, salary, status, note, ...userData } = req.body;
    const { email } = userData;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    userData.password = hashedPassword;
    userData.created_by = req.userId;

    if (allowedUpdateUser.includes(req.userRole)) userData.role = role;
    await userModel.create(userData);
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    next(error);
  }
};

//[POST] /users/:role
export const createUserWithRole = async (req, res, next) => {
  const { role: paramRole } = req.params;

  try {
    const { role, employmentType, certificates, major, startDate, salary, status, note, ...userData } = req.body;
    const employeeData = { employmentType, certificates, major, startDate, salary, status, note };

    const { email } = userData;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    userData.password = hashedPassword;
    userData.created_by = req.userId;

    if (allowedUpdateUser.includes(req.userRole)) userData.role = role;

    const refs = {};
    const newUser = await userModel.create(userData);
    if (EMPLOYEE_ROLES.includes(paramRole)) {
      employeeData.userId = newUser.id;
      const newEmployee = await employeeModel.create(employeeData);
      refs.userEmployees = { [newUser.id]: newEmployee };
    }

    res.status(201).json({ newUser, refs, message: "Tạo user thành công!" });
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

//[GET] /users/:role/:id
export const getUserByIdWithRole = async (req, res, next) => {
  const { role, id } = req.params;
  try {
    const { password, ...user } = await userModel.findById(id);

    const refs = {};
    if (EMPLOYEE_ROLES.includes(role)) {
      const employee = await employeeModel.findOne({ userId: id });
      refs.userEmployees = { [id]: employee };
    }

    res.status(201).json({ user, refs });
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

//[PATCH] /users/:role/:id
export const updateUserWithRole = async (req, res, next) => {
  const { role: paramRole, id } = req.params;
  try {
    if (!allowedUpdateUser.includes(req.userRole) && req.userId != id) {
      res.status(403).json({ message: "Quyền truy cập bị từ chối" });
      return;
    }

    // remove password, role, oid
    const {
      password,
      id: oid,
      employeeId,
      role,
      employmentType,
      certificates,
      major,
      startDate,
      salary,
      status,
      note,
      ...userData
    } = req.body;
    const employeeData = { employmentType, certificates, major, startDate, salary, status, note };

    if (allowedUpdateUser.includes(req.userRole)) {
      userData.role = role;
      if (password) userData.password = await bcrypt.hash(userData.password, 12);
    }

    userData.last_updated_at = new Date();
    userData.last_updated_by = req.userId;
    const updatedUser = await userModel.updateById(id, userData);

    const refs = {};
    if (EMPLOYEE_ROLES.includes(paramRole)) {
      if (employeeId) {
        const result = await employeeModel.updateById(employeeId, employeeData);
        refs.userEmployees = { [id]: result };
      } else {
        employeeData.userId = id;
        const result = await employeeModel.create(employeeData);
        refs.userEmployees = { [id]: result };
      }
    }

    res.status(201).json({ updatedUser, refs });
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
