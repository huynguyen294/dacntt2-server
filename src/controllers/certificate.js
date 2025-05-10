import { certificateModel } from "../models/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(certificateModel);
const certificateController = commonCRUD;

export default certificateController;
