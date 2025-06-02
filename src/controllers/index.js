import {
  certificateModel,
  classAttendanceModel,
  classExerciseModel,
  classModel,
  classScheduleModel,
  classTopicModel,
  courseModel,
  enrollmentModel,
  examModel,
  exerciseScoreModel,
  shiftModel,
  studentConsultationModel,
  studentExamModel,
  userModel,
} from "../models/index.js";
import { generateCRUD } from "./utils.js";
import otherUserControllers from "./user.js";

// userModel
const commonUserCRUD = generateCRUD(userModel, { searchFields: ["name", "email", "phoneNumber"] });
export const userController = { ...commonUserCRUD, ...otherUserControllers };

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

// classSchedule
const commonClassScheduleCRUD = generateCRUD(classScheduleModel);
export const classScheduleController = commonClassScheduleCRUD;

// classExercise
const commonClassExerciseCRUD = generateCRUD(classExerciseModel);
export const classExerciseController = commonClassExerciseCRUD;

// classTopic
const commonClassTopicCRUD = generateCRUD(classTopicModel, { isJunctionTable: true });
export const classTopicController = commonClassTopicCRUD;

// classAttendance
const commonClassAttendanceCRUD = generateCRUD(classAttendanceModel, []);
export const classAttendanceController = commonClassAttendanceCRUD;

// classAttendance
const commonExerciseScoreCRUD = generateCRUD(exerciseScoreModel, []);
export const classExerciseScoreController = commonExerciseScoreCRUD;
