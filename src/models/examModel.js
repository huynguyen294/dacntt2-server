import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultExam = {
  id: null,
  name: null,
  date: null,
  time: null,
  location: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("exams");

// other services

// model
const examModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultExam, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultExam, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
};

export default examModel;
