import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultTuitionDiscount = {
  id: null,
  amount: null,
  reason: null,
  studentId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("tuition_discount");

// other services

// model
const tuitionDiscountModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultTuitionDiscount, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultTuitionDiscount, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: transformFields,
};

export default tuitionDiscountModel;
