import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

// assign student into class

export const defaultEnrollment = {
  id: null,
  classId: null,
  studentId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("enrollments");

// other services
const getFields = (queryField) => transformFields(queryField, { basicFields: ["id", "class_id", "student_id"] });

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
  getFields,
};

export default enrollmentModel;
