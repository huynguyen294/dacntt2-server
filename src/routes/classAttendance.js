import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classAttendanceController } from "../controllers/index.js";
import { getClassAttendances } from "../controllers/classAttendance.js";
import { auth } from "../middlewares/index.js";

const classAttendanceRoute = express.Router();

// CRUD
generateCRUDRoutes(classAttendanceRoute, classAttendanceController);
// others
classAttendanceRoute.get("/by-class/:id", auth, getClassAttendances);

export default classAttendanceRoute;
