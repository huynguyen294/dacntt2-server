import express from "express";
import {
  createCertificate,
  deleteCertificate,
  getCertificateById,
  getCertificates,
  updateCertificate,
} from "../controllers/certificate.js";
import { auth, roles } from "../middlewares/index.js";

const certificateRoute = express.Router();

certificateRoute.get("/", auth, roles(["admin"]), getCertificates);
certificateRoute.post("/", auth, roles(["admin"]), createCertificate);
certificateRoute.get("/:id", auth, roles(["admin"]), getCertificateById);
certificateRoute.patch("/:id", auth, roles(["admin"]), updateCertificate);
certificateRoute.delete("/:id", auth, roles(["admin"]), deleteCertificate);

export default certificateRoute;
