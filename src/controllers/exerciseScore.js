import { exerciseScoreModel } from "../models/index.js";
import { arrayToObject } from "../utils/index.js";

export const studentStatuses = async (req, res, next) => {
  const { classId } = req.params;
  try {
    const result = await exerciseScoreModel.countBy(["studentId", "status"], { classId });
    res.status(200).json({ result: arrayToObject(result, "studentId") });
  } catch (error) {
    next(error);
  }
};
