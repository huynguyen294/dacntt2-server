import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultClassTopic = {
  id: null,
  name: null,
  classId: null,
  createdAt: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("class_topics");

// other services

// model
const courseModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultClassTopic, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultClassTopic, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: transformFields,
};

export default courseModel;
