import dbRoute from "./db.js";
import userRoute from "./user.js";
import authRoute from "./auth.js";
import classRoute from "./class.js";
import imageRoute from "./image.js";
import studentConsultationRoute from "./studentConsultation.js";
import classAttendanceRoute from "./classAttendance.js";
import classExerciseScoreRoute from "./exerciseScore.js";
import { generateCRUDRoutes } from "./utils.js";
import {
  certificateController,
  classExerciseController,
  classScheduleController,
  classTopicController,
  courseController,
  enrollmentController,
  examController,
  infoSheetController,
  shiftController,
  studentExamController,
  tuitionController,
  tuitionDiscountController,
} from "../controllers/index.js";
import { enrollmentMiddleWares } from "../controllers/enrollment.js";
import { auth } from "../middlewares/index.js";
import { getMainStudentData, getOtherStudentData } from "../controllers/student.js";
import { tuitionMiddleWares } from "../controllers/tuition.js";

const route = (app) => {
  app.use("/api-v1/auth", authRoute);
  app.use("/api-v1/users", userRoute);
  app.use("/api-v1/classes", classRoute);
  app.use("/api-v1/images", imageRoute);
  app.use("/api-v1/student-consultation", studentConsultationRoute);
  app.use("/api-v1/class-exercise-scores", classExerciseScoreRoute);
  app.use("/api-v1/class-attendances", classAttendanceRoute);
  app.use("/api-v1/enrollments", generateCRUDRoutes(enrollmentController, { middlewares: enrollmentMiddleWares }));
  app.use("/api-v1/student-exam", generateCRUDRoutes(studentExamController));
  app.use("/api-v1/courses", generateCRUDRoutes(courseController));
  app.use("/api-v1/certificates", generateCRUDRoutes(certificateController));
  app.use("/api-v1/shifts", generateCRUDRoutes(shiftController));
  app.use("/api-v1/class-exercises", generateCRUDRoutes(classExerciseController));
  app.use("/api-v1/exams", generateCRUDRoutes(examController));
  app.use("/api-v1/class-schedules", generateCRUDRoutes(classScheduleController));
  app.use("/api-v1/class-topics", generateCRUDRoutes(classTopicController));
  app.use("/api-v1/info-sheet", generateCRUDRoutes(infoSheetController));
  app.use("/api-v1/tuitions", generateCRUDRoutes(tuitionController, { middlewares: tuitionMiddleWares }));
  app.use("/api-v1/tuition-discounts", generateCRUDRoutes(tuitionDiscountController));
  app.get("/api-v1/student-data/main/:id", auth, getMainStudentData);
  app.get("/api-v1/student-data/other/:id", auth, getOtherStudentData);
  app.use("/api-v1/db", dbRoute);
  app.use((req, res, next) => {
    res.send("Không tìm thấy đường dẫn!");
  });
};

export default route;
