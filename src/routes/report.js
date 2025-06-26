import express from "express";
import { auth } from "../middlewares/index.js";
import {
  classIndicator,
  getAdmissionsPerMonth,
  getEnrollmentsPerMonth,
  getTotalStudent,
  getTotalStudentByClasses,
  getTuitionsPerMonth,
  studentIndicator,
  tuitionIndicator,
} from "../controllers/report.js";

const reportRoute = express.Router();

reportRoute.get("/student-indicator", auth, studentIndicator);
reportRoute.get("/total-student", auth, getTotalStudent);
reportRoute.get("/total-student-by-classes", auth, getTotalStudentByClasses);
reportRoute.get("/class-indicator", auth, classIndicator);
reportRoute.get("/tuition-indicator", auth, tuitionIndicator);
reportRoute.get("/enrollment-per-months", auth, getEnrollmentsPerMonth);
reportRoute.get("/admission-per-months", auth, getAdmissionsPerMonth);
reportRoute.get("/tuition-per-months", auth, getTuitionsPerMonth);

export default reportRoute;
