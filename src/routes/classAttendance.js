import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classAttendanceController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";

const classAttendanceRoute = express.Router();

generateCRUDRoutes(classAttendanceRoute, classAttendanceController);
// update many without id
classAttendanceRoute.patch("/", auth, classAttendanceController.update);

export default classAttendanceRoute;
