import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultClassExerciseTopic = {
  id: null,
  topicId: null,
  exerciseId: null,
  createdAt: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("class_exercise_topic");

// other services

// model
const courseModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultClassExerciseTopic, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultClassExerciseTopic, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: transformFields,
};

export default courseModel;
