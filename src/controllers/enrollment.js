import { enrollmentModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(enrollmentModel);
const enrollmentController = commonCRUD;

export default enrollmentController;
