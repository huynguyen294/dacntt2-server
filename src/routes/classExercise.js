import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classExerciseController } from "../controllers/index.js";

const classExerciseRoute = express.Router();

// CRUD
generateCRUDRoutes(classExerciseRoute, classExerciseController);
// others

export default classExerciseRoute;
