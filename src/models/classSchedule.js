import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultClassSchedule = {
  id: null,
  date: null,
  isAbsented: null,
  note: null,
  classId: null,
  shiftId: null,
  teacherId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("class_schedules");

// other services

// model
const courseModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultClassSchedule, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultClassSchedule, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: (queryField) =>
    transformFields(queryField, {
      basicFields: ["date", "classId", "shiftId", "teacherId"],
      defaultObject: defaultClassSchedule,
    }),
};

export default courseModel;
