import bcrypt from "bcryptjs";
import { userModel } from "../models/index.js";

//[GET] /users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(201).json({ users });
  } catch (error) {
    next(error);
  }
};

//[POST] /users/put
export const signUp = async (req, res, next) => {
  try {
    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;

    await userModel.create(data);
    res.status(201).json({ message: "Đăng ký thành công" });
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

const allowedUpdateUser = ["admin"];
//[PATCH] /users/:id
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    // if (!allowedUpdateUser.includes(req.userRole) && req.userId != id) {
    //   res.status(403).json({ message: "Quyền truy cập bị từ chối" });
    //   return;
    // }

    // remove password, role, oid
    const { password, role, id: oid, ...data } = req.body;
    const updatedUser = await userModel.updateById(id, data);
    res.status(201).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};

//[GET] /users/check-email/:email
export const checkUserByEMail = async (req, res, next) => {};

//[POST] /users/compare-password
export const compareUserPassword = async (req, res, next) => {};

//[GET] /users/forgot-password/:email
export const forgotPassword = async (req, res, next) => {};

//[GET] /users/verify-reset-password-code/:email/:code
export const verifyResetPasswordCode = async (req, res, next) => {};

//[PATCH] /users/reset-password/:email
export const resetPassword = async (req, res, next) => {};
