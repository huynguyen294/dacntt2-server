import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { classTopicController } from "../controllers/index.js";

const classTopicRoute = express.Router();

// CRUD
generateCRUDRoutes(classTopicRoute, classTopicController);
// others

export default classTopicRoute;
