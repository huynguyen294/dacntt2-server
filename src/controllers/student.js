import {
  classAttendanceModel,
  classExerciseModel,
  classModel,
  classScheduleModel,
  exerciseScoreModel,
  shiftModel,
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
    const [attendances, classExercises, [classExerciseScores], tuitions] = await Promise.all([
      classAttendanceModel.countBy(["studentId", "classId", "attend"], { studentId: id }),
      classExerciseModel.getByStudents([id], null, req.order),
      exerciseScoreModel.find({ studentId: id }),
    ]);

    res.status(200).json({ attendances, classExercises, classExerciseScores, tuitions });
  } catch (error) {
    next(error);
  }
};
