import pgDB from "../configs/db.js";
import camelCase from "lodash/camelCase.js";
import { ORDER, PAGER } from "../constants/index.js";
import { convertToSnakeShallow } from "../utils/index.js";
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
  async (filter = { ...defaultUser, ...defaultEmployee }, pager = PAGER, order = ORDER) => {
    const defaultUserConverted = convertToSnakeShallow(defaultUser);
    const defaultEmployeeConverted = convertToSnakeShallow(defaultEmployee);

    const userFilter = filterPropertyByDefaultObject(filter, defaultUserConverted, ["search"]);
    const employeeFilter = filterPropertyByDefaultObject(filter, defaultEmployeeConverted);
    const filterMerged = mergeFilterByShortName({ u: userFilter, e: employeeFilter });

    const [pagerGenerated, pagerStr] = await generatePager("users", userFilter, pager);

    const orderShortName = defaultUserConverted.hasOwnProperty(order.order_by) ? "u" : "e";
    const orderStr = generateOrderStr(order, orderShortName);
    const { id, user_id, ...employeeFields } = defaultEmployeeConverted;
    const fieldsStr =
      `u.*, e.id AS employee_id, ` +
      Object.keys(employeeFields)
        .map((key) => "e." + key)
        .join(", ");

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

const findEmployeeById = keyConvertWrapper(async (id) => {
  const { id: employeeId, user_id, ...employeeFields } = convertToSnakeShallow(defaultEmployee);
  const fieldsStr =
    `u.*, e.id AS employee_id, ` +
    Object.keys(employeeFields)
      .map((key) => "e." + key)
      .join(", ");

  const query = `SELECT ${fieldsStr} FROM users u LEFT JOIN employees e ON u.id = e.user_id WHERE u.id = $1`;
  const values = [id];

  console.log("findById:", query);
  const result = await pgDB.query(query, values);
  return result.rows[0] ?? null;
});

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
  findEmployee,
  findEmployeeById,
};

export default userModel;
