import { enrollmentModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(enrollmentModel, true);
const enrollmentController = commonCRUD;

export default enrollmentController;
