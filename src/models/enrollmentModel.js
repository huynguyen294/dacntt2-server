import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

// assign student into class

export const defaultEnrollment = {
  id: null,
  classId: null,
  userId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
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
