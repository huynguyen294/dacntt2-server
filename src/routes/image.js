import express from "express";
import imageController from "../controllers/image.js";
import { auth } from "../middlewares/index.js";

const imageRoute = express.Router();

imageRoute.post("/", auth, imageController.create);
imageRoute.patch("/:folder/:id", auth, imageController.update);
imageRoute.delete("/:folder/:id", auth, imageController.delete);

export default imageRoute;
