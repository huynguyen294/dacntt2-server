import express from "express";
import { studentConsultationController } from "../controllers/index.js";
import { generateCRUDRoutes } from "./utils.js";
import { studentConsultationMiddlewares } from "../controllers/studentConsultant.js";

const studentConsultationRoute = express.Router();
generateCRUDRoutes(studentConsultationRoute, studentConsultationController, {
  middlewares: studentConsultationMiddlewares,
});

export default studentConsultationRoute;
