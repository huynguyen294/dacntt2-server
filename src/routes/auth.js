import express from "express";
import { signIn, googleSignIn, generateNewAccessToken, signOut } from "../controllers/auth.js";

const authRoute = express.Router();

authRoute.post("/sign-in", signIn);
authRoute.post("/google-sign-in", googleSignIn);
authRoute.get("/sign-out", signOut);
authRoute.get("/new-access-token", generateNewAccessToken);

export default authRoute;
