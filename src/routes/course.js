import express from "express";
import { auth, roles } from "../middlewares/index.js";
import { generateCRUDRoutes } from "./utils.js";
import { courseController } from "../controllers/index.js";

const courseRoute = express.Router();

// CRUD
generateCRUDRoutes(courseRoute, courseController);
// others

export default courseRoute;
