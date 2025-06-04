import express from "express";
import { studentConsultationController } from "../controllers/index.js";
import { generateCRUDRoutes } from "./utils.js";
import { studentConsultationMiddlewares } from "../controllers/studentConsultation.js";

const studentConsultationRoute = express.Router();
generateCRUDRoutes(studentConsultationController, {
  router: studentConsultationRoute,
  middlewares: studentConsultationMiddlewares,
});

export default studentConsultationRoute;
