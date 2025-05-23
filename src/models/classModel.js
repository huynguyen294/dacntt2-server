import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices, generateFieldsStr, generateOrderStr, keyConvertWrapper } from "./utils.js";

export const defaultClass = {
  id: null,
  name: null,
  tuitionFee: null,
  weekDays: null,
  shifts: null,
  openingDay: null,
  closingDay: null,
  numberOfLessons: null,
  numberOfStudents: null,
  lastUpdatedAt: null,
  createdAt: null,
  courseId: null,
  teacherId: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("classes");

// other services
const getFields = (type) => transformFields(type, { basicFields: ["id", "name", "teacher_id", "shift_id"] });

const findUserClasses = keyConvertWrapper(async (userIds, pager = null, order = ORDER, fields = []) => {
  const fieldsStr = generateFieldsStr(fields, "c");
  const orderStr = generateOrderStr(order, "c");

  const query = `
  SELECT ${fieldsStr}, e.id as enrollment_id, e.student_id
  FROM enrollments e
  JOIN classes c ON e.class_id = c.id 
  WHERE e.student_id = ANY($1)
  ${orderStr}
  `;

  const values = [userIds];

  console.log("findUserClasses:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

const findStudents = keyConvertWrapper(async (classIds, pager = null, order = ORDER, userFields = []) => {
  const fieldsStr = generateFieldsStr(userFields, "u");
  const orderStr = generateOrderStr(order, "u");

  const query = `
  SELECT ${fieldsStr}, e.id as enrollment_id, e.class_id
  FROM enrollments e
  JOIN users u ON e.student_id = u.id 
  WHERE e.class_id = ANY($1)
  ${orderStr}
  `;

  const values = [classIds];

  console.log("findStudents:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

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
  getFields,
  findStudents,
  findUserClasses,
};

export default classModel;
