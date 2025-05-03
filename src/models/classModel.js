import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices, keyConvertWrapper } from "./utils.js";

export const defaultClass = {
  id: null,
  name: null,
  cost: null,
  weekDays: null,
  shifts: null,
  openingDay: null,
  closingDay: null,
  numberOfLessons: null,
  numberOfStudents: null,
  status: null,
  lastUpdatedAt: null,
  createdAt: null,
  courseId: null,
  teacherId: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("classes");

// model
const classModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultClass, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultClass, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
};

export default classModel;
