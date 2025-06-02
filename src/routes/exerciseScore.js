import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classExerciseScoreController } from "../controllers/index.js";
import { studentStatuses } from "../controllers/exerciseScore.js";
import { auth } from "../middlewares/index.js";

const classExerciseScoreRoute = express.Router();

// CRUD
generateCRUDRoutes(classExerciseScoreRoute, classExerciseScoreController);
// others
classExerciseScoreRoute.get("/student-statuses/:classId", auth, studentStatuses);

export default classExerciseScoreRoute;
