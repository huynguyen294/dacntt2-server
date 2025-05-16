import {
  certificateModel,
  classModel,
  courseModel,
  enrollmentModel,
  examModel,
  shiftModel,
  studentConsultationModel,
  studentExamModel,
  userModel,
} from "../models/index.js";
import { generateCRUD } from "./utils.js";
import otherUserControllers from "./user.js";

// certificate
const commonCertificateCRUD = generateCRUD(certificateModel);
export const certificateController = commonCertificateCRUD;

// class
const commonClassCRUD = generateCRUD(classModel);
export const classController = commonClassCRUD;

// course
const commonCourseCRUD = generateCRUD(courseModel);
export const courseController = commonCourseCRUD;

// enrollment
const commonEnrollmentCRUD = generateCRUD(enrollmentModel);
export const enrollmentController = commonEnrollmentCRUD;

// exam
const commonExamCRUD = generateCRUD(examModel);
export const examController = commonExamCRUD;

// shift
const commonShiftCRUD = generateCRUD(shiftModel);
export const shiftController = commonShiftCRUD;

// studentConsultation
const commonStudentConsultationCRUD = generateCRUD(studentConsultationModel);
export const studentConsultationController = commonStudentConsultationCRUD;

// studentExam
const commonStudentExamCRUD = generateCRUD(studentExamModel);
export const studentExamController = commonStudentExamCRUD;

// userModel
const commonUserCRUD = generateCRUD(userModel, { searchFields: ["name", "email", "phoneNumber"] });
export const userController = { ...commonUserCRUD, ...otherUserControllers };
