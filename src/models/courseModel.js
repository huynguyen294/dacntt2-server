import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultCourse = {
  id: null,
  email: null,
  level: null,
  number_of_lessons: null,
  status: null,
  created_at: null,
};

// commonServices
const commonServices = generateCommonServices("courses");

// other services

// model
const courseModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultCourse, pager = PAGER, order = ORDER) => commonServices.find(filter, pager, order),
  findOne: async (filter = defaultCourse) => commonServices.findOne(filter),
  exists: async (filter = defaultCourse) => commonServices.exists(filter),
};

export default courseModel;
