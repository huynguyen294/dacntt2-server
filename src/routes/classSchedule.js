import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classScheduleController } from "../controllers/index.js";

const classScheduleRoute = express.Router();

// CRUD
generateCRUDRoutes(classScheduleRoute, classScheduleController);

export default classScheduleRoute;
