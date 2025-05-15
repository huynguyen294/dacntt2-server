import express from "express";
import { userController } from "../controllers/index.js";
import { generateCRUDRoutes } from "./utils.js";
import { userMiddlewares } from "../controllers/user.js";

const userRoute = express.Router();

userRoute.post("/sign-up", userController.signUp);
userRoute.get("/check-email/:email", userController.checkUserByEMail);
userRoute.post("/:id/compare-password", userController.comparePassword);
userRoute.get("/forgot-password/:email", userController.forgotPassword);
userRoute.patch("/reset-password/:email", userController.resetPassword);
userRoute.get("/verify-reset-password-code/:email/:code", userController.verifyResetPasswordCode);
// crud
generateCRUDRoutes(userRoute, userController, { middlewares: userMiddlewares });

export default userRoute;
