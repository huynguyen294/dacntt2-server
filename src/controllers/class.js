import { auth, roles } from "../middlewares/index.js";
import { classModel, courseModel, shiftModel, userModel } from "../models/index.js";
import { arrayToObject, transformQueryToFilterObject } from "../utils/index.js";

// [GET] /classes?refs=true
const getClassWithRefs = async (req, res, next) => {
  try {
    const { refs } = req.query;
    if (refs !== "true") return next();

    const { refFields = ":basic" } = req.query;
    const filterObj = transformQueryToFilterObject(req.query);
    const [rows, pager] = await classModel.find(filterObj, req.pager, req.order);

    const refData = {};
    const [userIds, shiftIds, courseIds] = rows.reduce(
      (acc, row) => {
        if (row.teacherId) acc[0].push(row.teacherId);
        if (row.createdBy) acc[0].push(row.createdBy);
        if (row.shiftId) acc[1].push(row.shiftId);
        if (row.courseId) acc[2].push(row.courseId);
        return acc;
      },
      [[], [], []]
    );

    const [[users], [shifts], [courses]] = await Promise.all([
      userModel.find({ id: { in: userIds } }, req.pager, null, userModel.getFields(refFields)),
      shiftModel.find({ id: { in: shiftIds } }, req.pager, null, shiftModel.getFields(refFields)),
      courseModel.find({ id: { in: courseIds } }, req.pager, null, courseModel.getFields(refFields)),
    ]);

    refData.users = arrayToObject(users, "id");
    refData.shifts = arrayToObject(shifts, "id");
    refData.courses = arrayToObject(courses, "id");

    res.status(200).json({ rows, pager, refs: refData });
  } catch (error) {
    next(error);
  }
};

export const classMiddleWares = {
  get: [auth, roles(["admin", "finance-officer"]), getClassWithRefs],
  create: [auth, roles(["admin", "finance-officer"])],
  delete: [auth, roles(["admin", "finance-officer"])],
  update: [auth, roles(["admin", "finance-officer"])],
  getById: [auth, roles(["admin", "finance-officer"])],
};
