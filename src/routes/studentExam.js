import express from "express";
import studentExamController from "../controllers/studentExam.js";
import { generateCRUDRoutes } from "./utils.js";

const studentExamRoute = express.Router();
generateCRUDRoutes(studentExamRoute, studentExamController);

export default studentExamRoute;
