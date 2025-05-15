import express from "express";
import { auth, roles } from "../middlewares/index.js";
import { generateCRUDRoutes } from "./utils.js";
import { courseController } from "../controllers/index.js";

const courseRoute = express.Router();

// CRUD
const commonMiddlewares = [auth, roles(["admin"])];
generateCRUDRoutes(courseRoute, courseController, {
  middlewares: {
    get: commonMiddlewares,
    create: commonMiddlewares,
    getById: commonMiddlewares,
    update: commonMiddlewares,
    delete: commonMiddlewares,
  },
});
// others

export default courseRoute;
