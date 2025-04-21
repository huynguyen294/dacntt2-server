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
  createdAt: null,
};

// commonServices
const commonServices = generateCommonServices("users");

// other services
const updateRole = async () => {};

// model
const userModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultUser, pager = PAGER, order = ORDER) => commonServices.find(filter, pager, order),
  findOne: async (filter = defaultUser) => commonServices.findOne(filter),
  updateRole,
};

export default userModel;
