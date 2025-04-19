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
} from "../controllers/user.js";
import { auth, role } from "../middlewares/index.js";

const userRoute = express.Router();

userRoute.post("/sign-up", signUp);
userRoute.get("/check-email/:email", checkUserByEMail);
userRoute.post("/compare-password", compareUserPassword);
userRoute.get("/forgot-password/:email", forgotPassword);
userRoute.patch("/reset-password/:email", resetPassword);
userRoute.get("/verify-reset-password-code/:email/:code", verifyResetPasswordCode);
userRoute.get("/:id", auth, getUserById);
userRoute.patch("/:id", auth, updateUser);
userRoute.get("/", auth, role(["admin"]), getAllUsers);

export default userRoute;
