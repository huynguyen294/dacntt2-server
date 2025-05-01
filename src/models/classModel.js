import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultClass = {
  id: null,
  email: null,
  level: null,
  numberOfLessons: null,
  status: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("classes");

// other services
const findByUserIds = async () => {};

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
