import express from "express";
import { createImage, deleteImage, updateImage } from "../controllers/image.js";
import { auth } from "../middlewares/index.js";

const imageRoute = express.Router();

imageRoute.post("/", auth, createImage);
imageRoute.patch("/:folder/:id", auth, updateImage);
imageRoute.delete("/:folder/:id", auth, deleteImage);

export default imageRoute;
