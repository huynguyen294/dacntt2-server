import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultShifts = {
  id: null,
  name: null,
  startTime: null,
  endTime: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("shifts");

// other services
const getFields = (type) => {
  switch (type) {
    case ":full":
      return [];
    case ":basic":
      return ["id", "name", "start_time", "end_time"];
    default:
      return [];
  }
};

// model
const courseModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultShifts, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultShifts, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields,
};

export default courseModel;
