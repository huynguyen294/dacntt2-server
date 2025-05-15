import { studentConsultationModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(studentConsultationModel);
const studentConsultationController = commonCRUD;

export default studentConsultationController;
