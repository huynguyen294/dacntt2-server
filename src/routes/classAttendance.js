import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classAttendanceController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";
import { checkLessons, getWithRefs } from "../controllers/attendance.js";

const classAttendanceRoute = express.Router();
generateCRUDRoutes(classAttendanceController, { middlewares: { get: [getWithRefs] }, router: classAttendanceRoute });
classAttendanceRoute.get("/check-lessons/:classId", auth, checkLessons);

export default classAttendanceRoute;
