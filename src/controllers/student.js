import { COURSE_STATUSES } from "../constants/index.js";
import {
  classAttendanceModel,
  classExerciseModel,
  classModel,
  classScheduleModel,
  classTopicModel,
  courseModel,
  exerciseScoreModel,
  shiftModel,
  studentConsultationModel,
  userModel,
} from "../models/index.js";

export const getMainStudentData = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [[shifts], classes, schedules, teachers] = await Promise.all([
      shiftModel.find(),
      classModel.findUserClasses([id], null, req.order),
      classScheduleModel.getByStudents([id], null, req.order),
      userModel.getTeachersByStudents([id], null, req.order),
    ]);

    res.status(200).json({ shifts, classes, schedules, teachers });
  } catch (error) {
    next(error);
  }
};

export const getOtherStudentData = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [attendances, classExercises, [classExerciseScores], [courses], classTopics, [consultations]] =
      await Promise.all([
        classAttendanceModel.countBy(["studentId", "classId", "attend"], { studentId: id }),
        classExerciseModel.getByStudents([id], null, req.order),
        exerciseScoreModel.find({ studentId: id }),
        courseModel.find({ status: COURSE_STATUSES.active }),
        classTopicModel.getByStudents([id], null, req.order),
        studentConsultationModel.find({ studentId: id }, null, req.order),
      ]);

    res
      .status(200)
      .json({ attendances, classExercises, classExerciseScores, courses, classTopics, consultations, tuitions: [] });
  } catch (error) {
    next(error);
  }
};
