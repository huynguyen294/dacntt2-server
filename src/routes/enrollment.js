import express from "express";
import { enrollmentController } from "../controllers/index.js";
import { generateCRUDRoutes } from "./utils.js";

const enrollmentRoute = express.Router();
generateCRUDRoutes(enrollmentRoute, enrollmentController);

export default enrollmentRoute;
