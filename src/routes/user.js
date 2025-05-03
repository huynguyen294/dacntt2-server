import express from "express";
import {
  checkUserByEMail,
  updateUser,
  forgotPassword,
  resetPassword,
  verifyResetPasswordCode,
  compareUserPassword,
  signUp,
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  createUserWithRole,
  updateUserWithRole,
  getUserByIdWithRole,
  getUsersWithRole,
} from "../controllers/user.js";
import { auth, roles } from "../middlewares/index.js";

const userRoute = express.Router();

userRoute.post("/sign-up", signUp);
userRoute.get("/check-email/:email", checkUserByEMail);
userRoute.post("/compare-password", compareUserPassword);
userRoute.get("/forgot-password/:email", forgotPassword);
userRoute.patch("/reset-password/:email", resetPassword);
userRoute.get("/verify-reset-password-code/:email/:code", verifyResetPasswordCode);
userRoute.get("/with-role/:role", auth, roles(["admin"]), getUsersWithRole);
userRoute.post("/:role", auth, createUserWithRole);
userRoute.post("/", auth, createUser);
userRoute.get("/:role/:id", auth, getUserByIdWithRole);
userRoute.get("/:id", auth, getUserById);
userRoute.patch("/:role/:id", auth, updateUserWithRole);
userRoute.patch("/:id", auth, updateUser);
userRoute.delete("/:id", auth, deleteUserById);
userRoute.get("/", auth, roles(["admin"]), getAllUsers);

export default userRoute;
