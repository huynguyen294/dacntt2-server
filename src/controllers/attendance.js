import { classAttendanceModel } from "../models/index.js";
import { arrayToObject, transformFields, transformQueryToFilterObject } from "../utils/index.js";
import groupBy from "lodash/groupBy.js";

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

export const getWithRefs = async (req, res, next) => {
  const { refs } = req.query;
  if (refs !== "true") return next();

  try {
    const filterObj = transformQueryToFilterObject(req.query, [], classAttendanceModel.tableName);
    const fields = classAttendanceModel.getFields
      ? classAttendanceModel.getFields(req.query.fields)
      : transformFields(req.query.fields);

    const [rows, pager] = await classAttendanceModel.find(filterObj, req.pager, req.order, fields);
    const result = await classAttendanceModel.countBy(["studentId", "attend"], { classId: filterObj.classId });

    return res.status(200).json({ rows, pager, refs: { studentAttends: groupBy(result, "studentId") } });
  } catch (error) {
    next(error);
  }
};
