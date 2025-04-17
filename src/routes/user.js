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

const userRoute = express.Router();

userRoute.get("/", getAllUsers);
userRoute.put("/sign-up", signUp);
userRoute.get("/check-email/:email", checkUserByEMail);
userRoute.post("/compare-password", compareUserPassword);
userRoute.get("/forgot-password/:email", forgotPassword);
userRoute.patch("/reset-password/:email", resetPassword);
userRoute.get("/verify-reset-password-code/:email/:code", verifyResetPasswordCode);
userRoute.get("/:id", getUserById);
userRoute.patch("/:id", updateUser);

export default userRoute;
