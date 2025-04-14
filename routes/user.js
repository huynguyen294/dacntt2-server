import express from "express";
import {
  checkUserByEMail,
  updateUser,
  forgotPassword,
  resetPassword,
  verifyResetPasswordCode,
  compareUserPassword,
} from "../controllers/user.js";

const router = express.Router();

router.get("/check-email/:email", checkUserByEMail);
router.post("/compare-password", compareUserPassword);
router.get("/forgot-password/:email", forgotPassword);
router.patch("/reset-password/:email", resetPassword);
router.get("/verify-reset-password-code/:email/:code", verifyResetPasswordCode);
router.patch("/:id", updateUser);

export default router;
