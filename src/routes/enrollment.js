import express from "express";
import enrollmentModel from "../controllers/enrollment.js";
import { generateCRUDRoutes } from "./utils.js";

const enrollmentRoute = express.Router();
generateCRUDRoutes(enrollmentRoute, enrollmentModel);

export default enrollmentRoute;
