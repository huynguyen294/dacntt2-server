import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classAttendanceController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";
import { checkLessons, getWithRefs } from "../controllers/attendance.js";

const classAttendanceRoute = express.Router();

generateCRUDRoutes(classAttendanceRoute, classAttendanceController, { middlewares: { get: [getWithRefs] } });
// update many without id
classAttendanceRoute.patch("/", auth, classAttendanceController.update);
classAttendanceRoute.get("/check-lessons/:classId", auth, checkLessons);

export default classAttendanceRoute;
