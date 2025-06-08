import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices, generateFieldsStr, generateOrderStr, keyConvertWrapper } from "./utils.js";

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
const getByStudents = keyConvertWrapper(async (studentIds, pager = null, order = ORDER, fields = []) => {
  const fieldsStr = generateFieldsStr(fields, "ct");
  const orderStr = generateOrderStr(order, "ct");

  const query = `
  SELECT ${fieldsStr}
  FROM class_topics ct
  JOIN classes c ON ct.class_id = c.id 
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
