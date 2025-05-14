import express from "express";
import { auth, roles } from "../middlewares/index.js";
import { generateCRUDRoutes } from "./utils.js";
import classController, { classMiddleWares } from "../controllers/class.js";

const classRoute = express.Router();

const commonMiddlewares = [auth, roles(["admin", "finance-officer"])];
generateCRUDRoutes(classRoute, classController, {
  middlewares: {
    get: [...commonMiddlewares, ...classMiddleWares.get],
    create: commonMiddlewares,
    getById: commonMiddlewares,
    update: commonMiddlewares,
    delete: commonMiddlewares,
  },
});

export default classRoute;
