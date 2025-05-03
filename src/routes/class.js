import express from "express";
import { createClass, deleteClass, getClassById, getClasses, updateClass } from "../controllers/class.js";
import { auth, roles } from "../middlewares/index.js";

const classRoute = express.Router();

classRoute.get("/", auth, roles(["admin", "finance-officer"]), getClasses);
classRoute.post("/", auth, roles(["admin", "finance-officer"]), createClass);
classRoute.get("/:id", auth, roles(["admin", "finance-officer"]), getClassById);
classRoute.patch("/:id", auth, roles(["admin", "finance-officer"]), updateClass);
classRoute.delete("/:id", auth, roles(["admin", "finance-officer"]), deleteClass);

export default classRoute;
