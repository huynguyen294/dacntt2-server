import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultEnrollment = {
  id: null,
  class_id: null,
  student_id: null,
};

// commonServices
const commonServices = generateCommonServices("enrollments");

// other services

// model
const enrollmentModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultEnrollment, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultEnrollment, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
};

export default enrollmentModel;
