import { generateCommonServices } from "./utils.js";

const defaultUser = {
  id: null,
  email: null,
  password: null,
  name: null,
  role: null,
  date_of_birth: null,
  phone_number: null,
  create_at: null,
};

// commonServices
const commonServices = generateCommonServices("users");

// other services
const updateRole = async () => {};

// model
const userModel = {
  ...commonServices,
  // field suggestion for find funcs
  find: async (filter = defaultUser) => commonServices.find(filter),
  findOne: async (filter = defaultUser) => commonServices.findOne(filter),
  updateRole,
};

export default userModel;
