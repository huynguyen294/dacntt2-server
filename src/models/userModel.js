import { ORDER, PAGER } from "../constants/index.js";
import { generateCommonServices } from "./utils.js";

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
};

export default userModel;
