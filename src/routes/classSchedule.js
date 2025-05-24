import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classScheduleController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";
import { getClassSchedule } from "../controllers/schedule.js";

const classScheduleRoute = express.Router();

// CRUD
generateCRUDRoutes(classScheduleRoute, classScheduleController);
// others
classScheduleRoute.get("/by-class/:id", auth, getClassSchedule);

export default classScheduleRoute;
