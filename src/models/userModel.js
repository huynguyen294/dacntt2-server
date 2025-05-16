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

    const [pagerGenerated, pagerStr] = await generatePager("users", userFilter, pager);

    const orderShortName = defaultUserConverted.hasOwnProperty(order.order_by) ? "u" : "e";
    const orderStr = generateOrderStr(order, orderShortName);
    const { id, user_id, ...employee } = defaultEmployeeConverted;
    const filteredFields =
      employeeFields.length > 0
        ? Object.keys(employee).filter((f) => employeeFields.includes(f))
        : Object.keys(employee);

    const fieldsStr = `u.*, e.id AS employee_id, ` + filteredFields.map((key) => "e." + key).join(", ");

    const query = `SELECT ${fieldsStr} FROM users u LEFT JOIN employees e ON u.id = e.user_id`;
    const { filterStr, values } = generateFilterString(filterMerged, pager);
    const finalQuery = query + filterStr + orderStr + pagerStr;

    if (pagerStr) {
      values.push(pager.page_size);
      const offset = (pager.page - 1) * pager.page_size;
      values.push(offset);
    }

    console.log("find employee:", finalQuery, values);
    const result = await pgDB.query(finalQuery, values);
    return [result.rows, pagerGenerated];
  }
);

const findEmployeeById = keyConvertWrapper(async (id, employeeFields) => {
  const { id: employeeId, user_id, ...employee } = convertToSnakeShallow(defaultEmployee);

  const filteredFields =
    employeeFields.length > 0 ? Object.keys(employee).filter((f) => employeeFields.includes(f)) : Object.keys(employee);

  const fieldsStr = `u.*, e.id AS employee_id, ` + filteredFields.map((key) => "e." + key).join(", ");
  const query = `SELECT ${fieldsStr} FROM users u LEFT JOIN employees e ON u.id = e.user_id WHERE u.id = $1`;
  const values = [id];

  console.log("findById:", query);
  const result = await pgDB.query(query, values);
  return result.rows[0] ?? null;
});

const getFields = (type) => transformFields(type, { basicFields: ["id", "name", "email", "role"] });

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
};

export default userModel;
