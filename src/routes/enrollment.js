import express from "express";
import { enrollmentController } from "../controllers/index.js";
import { generateCRUDRoutes } from "./utils.js";
import { enrollmentMiddleWares } from "../controllers/enrollment.js";

const enrollmentRoute = express.Router();
generateCRUDRoutes(enrollmentRoute, enrollmentController, { middlewares: enrollmentMiddleWares });

export default enrollmentRoute;
