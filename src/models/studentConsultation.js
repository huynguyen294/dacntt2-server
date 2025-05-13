import { ORDER, PAGER } from "../constants/index.js";
import { defaultEmployee } from "./employeeModel.js";
import { generateCommonServices } from "./utils.js";

export const defaultStudentConsultation = {
  id: null,
  email: null,
  name: null,
  dateOfBirth: null,
  phoneNumber: null,
  address: null,
  status: null,
  source: null,
  note: null,
  expected_course_id: null,
  expected_class_id: null,
  lastUpdatedAt: null,
  createdAt: null,
  lastUpdatedBy: null,
  createdBy: null,
};

// commonServices
const commonServices = generateCommonServices("student_consultation");

// other services
const getFields = (type) => {
  switch (type) {
    case "basic":
      return ["id", "name", "email"];
    case "full":
    default:
      return [];
  }
};

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
  getFields,
};

export default studentConsultationModel;
