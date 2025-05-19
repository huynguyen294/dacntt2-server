import express from "express";
import { generateCRUDRoutes } from "./utils.js";
import { shiftController } from "../controllers/index.js";

const shiftRoute = express.Router();

generateCRUDRoutes(shiftRoute, shiftController);

export default shiftRoute;
