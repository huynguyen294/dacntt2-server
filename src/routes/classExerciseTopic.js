import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classExerciseTopicController } from "../controllers/index.js";

const classExerciseTopicRoute = express.Router();

// CRUD
generateCRUDRoutes(classExerciseTopicRoute, classExerciseTopicController);
// others

export default classExerciseTopicRoute;
