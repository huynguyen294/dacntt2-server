import dbRoute from "./db.js";
import userRoute from "./user.js";
import authRoute from "./auth.js";
import courseRoute from "./course.js";
import classRoute from "./class.js";
import enrollmentRoute from "./enrollment.js";
import imageRoute from "./image.js";
import certificateRoute from "./certificate.js";
import shiftRoute from "./shift.js";
import examRoute from "./exam.js";
import studentExamRoute from "./studentExam.js";
import studentConsultationRoute from "./studentConsultation.js";
import classScheduleRoute from "./classSchedule.js";
import classExerciseRoute from "./classExercise.js";
import classTopicRoute from "./classTopic.js";
import classAttendanceRoute from "./classAttendance.js";
import classExerciseScoreRoute from "./exerciseScore.js";

const route = (app) => {
  app.use("/api-v1/auth", authRoute);
  app.use("/api-v1/users", userRoute);
  app.use("/api-v1/courses", courseRoute);
  app.use("/api-v1/classes", classRoute);
  app.use("/api-v1/enrollments", enrollmentRoute);
  app.use("/api-v1/images", imageRoute);
  app.use("/api-v1/certificates", certificateRoute);
  app.use("/api-v1/shifts", shiftRoute);
  app.use("/api-v1/exams", examRoute);
  app.use("/api-v1/student-exam", studentExamRoute);
  app.use("/api-v1/student-consultation", studentConsultationRoute);
  app.use("/api-v1/class-schedules", classScheduleRoute);
  app.use("/api-v1/class-exercises", classExerciseRoute);
  app.use("/api-v1/class-exercise-scores", classExerciseScoreRoute);
  app.use("/api-v1/class-topics", classTopicRoute);
  app.use("/api-v1/class-attendances", classAttendanceRoute);
  app.use("/api-v1/db", dbRoute);
  app.use((req, res, next) => {
    res.send("Không tìm thấy đường dẫn!");
  });
};

export default route;
