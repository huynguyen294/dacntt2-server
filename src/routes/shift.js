import express from "express";
import { auth, roles } from "../middlewares/index.js";
import { generateCRUDRoutes } from "./utils.js";
import { shiftController } from "../controllers/index.js";

const shiftRoute = express.Router();

const commonMiddlewares = [auth, roles(["admin"])];
generateCRUDRoutes(shiftRoute, shiftController, {
  middlewares: {
    get: commonMiddlewares,
    create: commonMiddlewares,
    getById: commonMiddlewares,
    update: commonMiddlewares,
    delete: commonMiddlewares,
  },
});

export default shiftRoute;
