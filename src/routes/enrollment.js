import express from "express";
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from "../controllers/course.js";
import { auth, roles } from "../middlewares/index.js";

const courseRoute = express.Router();

courseRoute.get("/", auth, roles(["admin", "teacher"]), getCourses);
courseRoute.post("/", auth, roles(["admin", "teacher"]), createCourse);
courseRoute.get("/:id", auth, roles(["admin", "teacher"]), getCourseById);
courseRoute.patch("/:id", auth, roles(["admin", "teacher"]), updateCourse);
courseRoute.delete("/:id", auth, roles(["admin", "teacher"]), deleteCourse);

export default courseRoute;
