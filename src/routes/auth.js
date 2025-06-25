import express from "express";
import authController from "../controllers/auth.js";
import { auth } from "../middlewares/index.js";

const authRoute = express.Router();

authRoute.post("/sign-in", authController.signIn);
authRoute.post("/google-signin", authController.googleSignIn);
authRoute.get("/sign-out", auth, authController.signOut);
authRoute.get("/new-access-token", authController.generateNewAccessToken);

export default authRoute;
