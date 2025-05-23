import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classController } from "../controllers/index.js";
import { classMiddleWares, getClassStudents } from "../controllers/class.js";
import { auth } from "../middlewares/index.js";

const classRoute = express.Router();
classRoute.get("/:id/students", auth, getClassStudents);
generateCRUDRoutes(classRoute, classController, { middlewares: classMiddleWares });

export default classRoute;
