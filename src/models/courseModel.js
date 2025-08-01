import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultCourse = {
  id: null,
  name: null,
  level: null,
  numberOfLessons: null,
  numberOfStudents: null,
  status: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("courses");

// other services

// model
const courseModel = {
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
  getFields: transformFields,
};

export default courseModel;
