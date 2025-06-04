import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices, generateFieldsStr } from "./utils.js";

export const defaultInfoSheet = {
  id: null,
  content: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("info_sheet");

// model
const infoSheetModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultInfoSheet, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultInfoSheet, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  generateFieldsStr,
};

export default infoSheetModel;
