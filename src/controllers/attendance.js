import { classAttendanceModel } from "../models/index.js";
import { arrayToObject } from "../utils/index.js";

// /class-attendances/check-lessons/:classId
export const checkLessons = async (req, res, next) => {
  const { classId } = req.params;
  try {
    const result = await classAttendanceModel.countBy("lessonId", { classId });
    res.status(200).json({ result: arrayToObject(result, "lessonId") });
  } catch (error) {
    next(error);
  }
};
