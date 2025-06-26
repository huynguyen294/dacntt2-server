import express from "express";
import { auth } from "../middlewares/index.js";
import { classIndicator, studentIndicator, tuitionIndicator } from "../controllers/report.js";

const reportRoute = express.Router();

reportRoute.get("/student-indicator", auth, studentIndicator);
reportRoute.get("/class-indicator", auth, classIndicator);
reportRoute.get("/tuition-indicator", auth, tuitionIndicator);
// crud

export default reportRoute;
