import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultTuition = {
  id: null,
  amount: null,
  date: null,
  note: null,
  classId: null,
  studentId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("tuition");

// other services
const getFields = (type) => transformFields(type, { basicFields: ["id", "date", "amount", "student_id", "class_id"] });

// model
const tuitionModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultTuition, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultTuition, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields,
};

export default tuitionModel;
