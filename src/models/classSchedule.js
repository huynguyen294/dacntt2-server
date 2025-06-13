import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { transformFields } from "../utils/index.js";
import { generateCommonServices, generateFieldsStr, generateOrderStr, keyConvertWrapper } from "./utils.js";

export const defaultClassSchedule = {
  id: null,
  date: null,
  isAbsented: null,
  note: null,
  classId: null,
  shiftId: null,
  teacherId: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("class_schedules");

// other services
const getByStudents = keyConvertWrapper(async (studentIds, pager = null, order = ORDER, fields = []) => {
  const fieldsStr = generateFieldsStr(fields, "s");
  const orderStr = generateOrderStr(order, "s");

  const query = `
  SELECT ${fieldsStr}
  FROM class_schedules s
  JOIN classes c ON s.class_id = c.id 
  JOIN enrollments e ON e.class_id = c.id 
  WHERE e.student_id = ANY($1)
  ${orderStr}
  `;

  const values = [studentIds];

  console.log("findStudentSchedules:", query, values);
  const result = await pgDB.query(query, values);
  return result.rows;
});

// model
const classScheduleModel = {
  ...commonServices,
  getByStudents,
  // field suggestion for find funcs
  find: async (filter = defaultClassSchedule, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultClassSchedule, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  getFields: (queryField) =>
    transformFields(queryField, {
      basicFields: ["date", "classId", "shiftId", "teacherId"],
      defaultObject: defaultClassSchedule,
    }),
};

export default classScheduleModel;
