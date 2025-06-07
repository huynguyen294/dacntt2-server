import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices, generateFieldsStr, generateOrderStr, keyConvertWrapper } from "./utils.js";

export const defaultClassExercise = {
  id: null,
  title: null,
  description: null,
  due_day: null,
  class_id: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("class_exercises");

// other services
const getByStudents = keyConvertWrapper(async (studentIds, pager = null, order = ORDER, fields = []) => {
  const fieldsStr = generateFieldsStr(fields, "ce");
  const orderStr = generateOrderStr(order, "ce");

  const query = `
  SELECT ${fieldsStr}
  FROM class_exercises ce
  JOIN classes c ON ce.class_id = c.id 
  JOIN enrollments e ON e.class_id = c.id 
  WHERE e.student_id = ANY($1)
  ${orderStr}
  `;

  const values = [studentIds];

  console.log("findStudentExercises:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

// model
const courseModel = {
  ...commonServices,
  getByStudents,
  // field suggestion for find funcs
  find: async (filter = defaultClassExercise, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultClassExercise, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: transformFields,
};

export default courseModel;
