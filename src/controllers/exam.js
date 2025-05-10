import { examModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(examModel);
const examController = commonCRUD;

export default examController;
