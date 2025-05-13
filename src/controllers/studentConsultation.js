import { studentConsultation } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(studentConsultation, true);
const studentConsultationController = commonCRUD;

export default studentConsultationController;
