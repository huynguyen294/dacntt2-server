import express from "express";
import { signIn, signUp, googleSignIn, generateNewAccessToken, signOut } from "../controllers/auth.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/sign-out", signOut);
router.post("/google-sign-in", googleSignIn);
router.get("/new-access-token", generateNewAccessToken);

export default router;
