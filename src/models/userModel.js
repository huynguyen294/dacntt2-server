import pgDB from "../configs/db.js";
import { ORDER, PAGER } from "../constants/index.js";
import { convertToSnakeShallow, transformFields } from "../utils/index.js";
import { defaultEmployee } from "./employeeModel.js";
import {
  filterPropertyByDefaultObject,
  generateCommonServices,
  generateFieldsStr,
  generateFilterString,
  generateOrderStr,
  generatePager,
  keyConvertWrapper,
  mergeFilterByShortName,
} from "./utils.js";

export const defaultUser = {
  id: null,
  email: null,
  password: null,
  name: null,
  gender: null,
  role: null,
  dateOfBirth: null,
  phoneNumber: null,
  address: null,
  imageUrl: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

const { password, ...defaultObject } = defaultUser;

// commonServices
const commonServices = generateCommonServices("users");

// other services
const findEmployee = keyConvertWrapper(
  async (filter = { ...defaultUser, ...defaultEmployee }, pager = PAGER, order = ORDER, employeeFields = []) => {
    const defaultUserConverted = convertToSnakeShallow(defaultUser);
    const defaultEmployeeConverted = convertToSnakeShallow(defaultEmployee);

    const userFilter = filterPropertyByDefaultObject(filter, defaultUserConverted, ["search"]);
    const employeeFilter = filterPropertyByDefaultObject(filter, defaultEmployeeConverted);
    const filterMerged = mergeFilterByShortName({ u: userFilter, e: employeeFilter });
    if (filterMerged["u.search"]) {
      filterMerged["u.search"] = filterMerged["u.search"].map((obj) => ({
        [`u.${Object.keys(obj)[0]}`]: Object.values(obj)[0],
      }));
    }

    const orderShortName = defaultUserConverted.hasOwnProperty(order.order_by) ? "u" : "e";
    const orderStr = generateOrderStr(order, orderShortName);
    const { id, user_id, ...employee } = defaultEmployeeConverted;
    const filteredFields =
      employeeFields.length > 0
        ? Object.keys(employee).filter((f) => employeeFields.includes(f))
        : Object.keys(employee);

    const { password, ...userFields } = defaultUserConverted;
    const userFieldsStr = generateFieldsStr(Object.keys(userFields), "u");
    const fieldsStr = `${userFieldsStr}, e.id AS employee_id, ` + filteredFields.map((key) => "e." + key).join(", ");

    const query = `SELECT ${fieldsStr} FROM users u LEFT JOIN employees e ON u.id = e.user_id`;
    const { filterStr, values } = generateFilterString(filterMerged);
    const [pagerGenerated, pagerStr] = await generatePager("users", userFilter, pager, values.length);

    if (pagerStr) {
      values.push(pager.page_size);
      const offset = (pager.page - 1) * pager.page_size;
      values.push(offset);
    }

    const finalQuery = query + filterStr + orderStr + pagerStr;

    console.log("find employee:", finalQuery, values);
    const result = await pgDB.query(finalQuery, values);
    return [result.rows, pagerGenerated];
  }
);

const findEmployeeById = keyConvertWrapper(async (id, employeeFields) => {
  const { id: employeeId, user_id, ...employee } = convertToSnakeShallow(defaultEmployee);

  const filteredFields =
    employeeFields.length > 0 ? Object.keys(employee).filter((f) => employeeFields.includes(f)) : Object.keys(employee);

  const { password, ...userFields } = defaultUserConverted;
  const userFieldsStr = generateFieldsStr(Object.keys(userFields), "u");
  const fieldsStr = `${userFieldsStr}, e.id AS employee_id, ` + filteredFields.map((key) => "e." + key).join(", ");
  const query = `SELECT ${fieldsStr} FROM users u LEFT JOIN employees e ON u.id = e.user_id WHERE u.id = $1`;
  const values = [id];

  console.log("findById:", query);
  const result = await pgDB.query(query, values);
  return result.rows[0] ?? null;
});

const getFields = (type) =>
  transformFields(type, { basicFields: ["id", "name", "email", "role", "image_url"], defaultObject });

const getTeachersByStudents = keyConvertWrapper(
  async (studentIds, pager = null, order = ORDER, fields = getFields(":basic")) => {
    const fieldsStr = generateFieldsStr(fields, "u");
    // const orderStr = generateOrderStr(order, "u");

    const query = `
    SELECT DISTINCT ${fieldsStr}
    FROM users u
    JOIN class_schedules s ON u.id = s.teacher_id  
    JOIN enrollments e ON s.class_id = e.class_id
    WHERE e.student_id = ANY($1)
    `;

    const values = [studentIds];

    console.log("getTeachersByStudents:", query, values);
    const result = await pgDB.query(query, values);
    return result.rows;
  }
);

// model
const userModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultUser, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultUser, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
  // other services
  getFields,
  findEmployee,
  findEmployeeById,
  getTeachersByStudents,
};

export default userModel;
