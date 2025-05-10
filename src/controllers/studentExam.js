import { studentExamModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(studentExamModel, true);
const studentExamController = commonCRUD;

export default studentExamController;
