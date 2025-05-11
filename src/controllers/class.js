import { classModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(classModel);
const classController = commonCRUD;

export default classController;
