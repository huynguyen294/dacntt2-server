import { studentConsultationModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(studentConsultationModel, true);
const studentConsultationController = commonCRUD;

export default studentConsultationController;
