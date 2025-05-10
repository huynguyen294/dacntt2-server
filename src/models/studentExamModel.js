import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultCourse = {
  id: null,
  exam_id: null,
  student_id: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("student_exam");

// other services

// model
const studentExamModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultCourse, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultCourse, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
};

export default studentExamModel;
