import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultExerciseScore = {
  id: null,
  score: null,
  status: null,
  exerciseId: null,
  studentId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("class_exercise_scores");

// other services

// model
const exerciseScoreModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultExerciseScore, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultExerciseScore, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: transformFields,
};

export default exerciseScoreModel;
