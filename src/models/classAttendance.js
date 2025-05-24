import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultClassAttendance = {
  id: null,
  date: null,
  attend: null,
  note: null,
  classId: null,
  studentId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("class_attendances");

// other services

// model
const classAttendanceModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultClassAttendance, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultClassAttendance, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: transformFields,
};

export default classAttendanceModel;
