import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices, keyConvertWrapper } from "./utils.js";

// assign student into class

export const defaultEnrollment = {
  id: null,
  classId: null,
  studentId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("enrollments");

const enrollmentsPerMonth = keyConvertWrapper(async (year) => {
  const query = `SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(DISTINCT student_id) AS total
    FROM enrollments
    WHERE EXTRACT(YEAR FROM created_at) = $1
    GROUP BY month
    ORDER BY month
    `;

  const values = [year];

  console.log("enrollmentsPerMonth:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

const allStudents = keyConvertWrapper(async () => {
  const query = `SELECT
  COUNT(DISTINCT e.student_id) AS total
  FROM enrollments e
  LEFT JOIN classes c ON e.class_id = c.id
  WHERE c.closing_day >= $1`;

  const values = [new Date()];

  console.log("allStudents:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

const allStudentByClasses = keyConvertWrapper(async () => {
  const query = `SELECT
  c.id,
  COUNT(DISTINCT e.student_id) AS total
  FROM enrollments e
  LEFT JOIN classes c ON e.class_id = c.id
  WHERE c.closing_day >= $1
  GROUP BY c.id`;

  const values = [new Date()];

  console.log("allStudents:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

// other services
const getFields = (queryField) => transformFields(queryField, { basicFields: ["id", "class_id", "student_id"] });

// model
const enrollmentModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultEnrollment, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultEnrollment, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  enrollmentsPerMonth,
  allStudents,
  allStudentByClasses,
  getFields,
};

export default enrollmentModel;
