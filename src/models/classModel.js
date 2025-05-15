import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices, generateFieldsStr, keyConvertWrapper } from "./utils.js";

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
const getFields = (type) => {
  switch (type) {
    case "full":
      return [];
    case "basic":
      return ["id", "name"];
    default:
      return [];
  }
};

const findUserClasses = keyConvertWrapper(async (userId, fields = []) => {
  const fieldsStr = generateFieldsStr(fields, "c");

  const query = `
  SELECT ${fieldsStr}, e.id as enrollment_id
  FROM enrollments e 
  JOIN classes c ON e.class_id = c.id 
  WHERE e.student_id = $1
  `;

  const values = [userId];

  console.log("findOne:", query);
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
  findUserClasses,
};

export default classModel;
