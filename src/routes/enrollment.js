import express from "express";
import {
  createEnrollment,
  deleteEnrollment,
  getEnrollmentById,
  getEnrollments,
  updateEnrollment,
} from "../controllers/enrollment.js";
import { auth } from "../middlewares/index.js";

const enrollmentRoute = express.Router();

enrollmentRoute.get("/", auth, getEnrollments);
enrollmentRoute.post("/", auth, createEnrollment);
enrollmentRoute.get("/:id", auth, getEnrollmentById);
enrollmentRoute.patch("/:id", auth, updateEnrollment);
enrollmentRoute.delete("/:id", auth, deleteEnrollment);

export default enrollmentRoute;
