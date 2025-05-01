import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

export const defaultEmployee = {
  id: null,
  userId: null,
  salary: null,
  employmentType: null,
  major: null,
  certificates: null,
  note: null,
  startDate: null,
  status: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("employees");

// other services

// model
const employeeModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultEmployee, pager = PAGER, order = ORDER, fields = []) => {
    return commonServices.find(filter, pager, order, fields);
  },
  findOne: async (filter = defaultEmployee, fields = []) => {
    return commonServices.findOne(filter, fields);
  },
  exists: async (filter = defaultEmployee) => {
    return commonServices.exists(filter);
  },
};

export default employeeModel;
