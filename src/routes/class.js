import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classController } from "../controllers/index.js";
import { classMiddleWares } from "../controllers/class.js";

const classRoute = express.Router();
generateCRUDRoutes(classRoute, classController, { middlewares: classMiddleWares });

export default classRoute;
