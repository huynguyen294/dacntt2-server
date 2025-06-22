import {
  userModel,
  courseModel,
  employeeModel,
  classModel,
  enrollmentModel,
  certificateModel,
  shiftModel,
  examModel,
  studentExamModel,
  studentConsultationModel,
  classScheduleModel,
  classExerciseModel,
  classTopicModel,
  classAttendanceModel,
  exerciseScoreModel,
  infoSheetModel,
  tuitionModel,
  tuitionDiscountModel,
} from "../models/index.js";

export const PAGER = { total: 0, pageCount: 1, page: 1, pageSize: 20 };
export const ORDER = { order: "DESC", orderBy: "created_at" };
export const EMPLOYEE_ROLES = ["consultant", "finance-officer", "teacher"];
export const DATE_FORMAT = "yyyy-MM-dd";

const ROLES = ["admin", "create", "read", "read_own", "update", "update_own", "delete", "delete_own"];

const PERMISSION_BY_ROLES = {
  admin: ["user:admin"],
  student: [
    "user:read_own",
    "user:update_own",
    "course:read",
    "class:read_own",
    "exam:read_own",
    "shift:read_own",
    "certificate:read_own",
    "enrollment:read_own",
  ],
  teacher: ["user:read_own", "user:update_own"],
  consultant: ["user:read_own", "user:update_own"],
  "finance-officer": ["user:read_own", "user:update_own"],
};

export const checkRoles = (userRole, role) => PERMISSION_BY_ROLES[userRole].includes(role);

export const COURSE_LEVELS = {
  1: "Sơ cấp",
  2: "Trung cấp",
  3: "Nâng cao",
};

export const CERTIFICATE_STATUSES = {
  active: "Hoạt động",
  onHold: "Tạm dừng",
  stopped: "Hết hạn",
};

export const COURSE_STATUSES = {
  active: "Đang mở",
  onHold: "Tạm đóng",
  stopped: "Không còn mở",
};

export const EMPLOYEE_STATUS = {
  active: "Đang làm việc",
  onHold: "Tạm nghỉ việc",
  stopped: "Đã nghỉ việc",
};

export const DEFAULT_SEARCH_FIELDS = ["id", "name"];
export const USER_SEARCH_FIELDS = ["id", "name", "email", "phone_number"];

export const ID_CODES = () => ({
  [userModel.tableName]: "ND",
  [courseModel.tableName]: "KH",
  [employeeModel.tableName]: "NV",
  [classModel.tableName]: "LH",
  [enrollmentModel.tableName]: "DK",
  [certificateModel.tableName]: "CC",
  [shiftModel.tableName]: "CH",
  [examModel.tableName]: "KT",
  [studentExamModel.tableName]: "HKT",
  [studentConsultationModel.tableName]: "TV",
  [classScheduleModel.tableName]: "LH",
  [classExerciseModel.tableName]: "BT",
  [classTopicModel.tableName]: "CD",
  [classAttendanceModel.tableName]: "DD",
  [exerciseScoreModel.tableName]: "DS",
  [infoSheetModel.tableName]: "TB",
  [tuitionModel.tableName]: "HP",
  [tuitionDiscountModel.tableName]: "GG",
});
