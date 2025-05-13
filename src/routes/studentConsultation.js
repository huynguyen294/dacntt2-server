import express from "express";
import studentConsultationController from "../controllers/studentConsultation.js";
import { generateCRUDRoutes } from "./utils.js";

const studentConsultationRoute = express.Router();
generateCRUDRoutes(studentConsultationRoute, studentConsultationController);

export default studentConsultationRoute;
