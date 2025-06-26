import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { defaultEmployee } from "./employeeModel.js";
import { generateCommonServices, keyConvertWrapper } from "./utils.js";

export const defaultStudentConsultation = {
  id: null,
  email: null,
  name: null,
  dateOfBirth: null,
  phoneNumber: null,
  address: null,
  status: null,
  source: null,
  studentId: null,
  note: null,
  expectedCourseId: null,
  expectedClassId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("student_consultation");

// other services
const getFields = (type) => transformFields(type, { basicFields: ["id", "name", "email"] });

const admissionsPerMonth = keyConvertWrapper(async (year) => {
  const query = `SELECT status,
    DATE_TRUNC('month', created_at) AS month,
    COUNT(DISTINCT student_id) AS total
    FROM student_consultation
    WHERE EXTRACT(YEAR FROM created_at) = $1
    GROUP BY month, status
    `;

  const values = [year];

  console.log("admissionsPerMonth:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

// model
const studentConsultationModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultStudentConsultation, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultStudentConsultation, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  // other services
  admissionsPerMonth,
  getFields,
};

export default studentConsultationModel;
