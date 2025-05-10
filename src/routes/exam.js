import express from "express";
import { auth, roles } from "../middlewares/index.js";
import { generateCRUDRoutes } from "./utils.js";
import examController from "../controllers/exam.js";

const examRoute = express.Router();

const commonMiddlewares = [auth, roles(["admin"])];
generateCRUDRoutes(examRoute, examController, {
  middlewares: {
    get: commonMiddlewares,
    create: commonMiddlewares,
    getById: commonMiddlewares,
    update: commonMiddlewares,
    delete: commonMiddlewares,
  },
});

export default examRoute;
