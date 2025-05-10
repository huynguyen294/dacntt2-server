import express from "express";
import { auth, roles } from "../middlewares/index.js";
import { getShifts, createShift, getShiftById, updateShift, deleteShift } from "../controllers/shift.js";

const shiftRoute = express.Router();

shiftRoute.get("/", auth, getShifts);
shiftRoute.post("/", auth, roles(["admin"]), createShift);
shiftRoute.get("/:id", auth, roles(["admin"]), getShiftById);
shiftRoute.patch("/:id", auth, roles(["admin"]), updateShift);
shiftRoute.delete("/:id", auth, roles(["admin"]), deleteShift);

export default shiftRoute;
