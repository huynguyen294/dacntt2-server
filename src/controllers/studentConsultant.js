import { auth, roles } from "../middlewares/index.js";
import { classModel, courseModel, studentConsultationModel, userModel } from "../models/index.js";
import { arrayToObject, transformQueryToFilterObject } from "../utils/index.js";

// [GET] /classes?refs=true
const getStudentWithRefs = async (req, res, next) => {
  try {
    const { refs } = req.query;
    if (refs !== "true") return next();

    const { refFields = ":basic" } = req.query;
    const filterObj = transformQueryToFilterObject(req.query);
    const [rows, pager] = await studentConsultationModel.find(filterObj, req.pager, req.order);

    const refData = {};
    const [userIds, classIds, courseIds] = rows.reduce(
      (acc, row) => {
        if (row.consultantId) acc[0].push(row.consultantId);
        if (row.createdBy) acc[0].push(row.createdBy);
        if (row.expectedClassId) acc[1].push(row.expectedClassId);
        if (row.expectedCourseId) acc[2].push(row.expectedCourseId);
        return acc;
      },
      [[], [], []]
    );

    const [[users], [classes], [courses]] = await Promise.all([
      userModel.find({ id: { in: userIds } }, req.pager, null, userModel.getFields(refFields)),
      classModel.find({ id: { in: classIds } }, req.pager, null, classModel.getFields(refFields)),
      courseModel.find({ id: { in: courseIds } }, req.pager, null, courseModel.getFields(refFields)),
    ]);

    refData.users = arrayToObject(users, "id");
    refData.classes = arrayToObject(classes, "id");
    refData.courses = arrayToObject(courses, "id");

    res.status(200).json({ rows, pager, refs: refData });
  } catch (error) {
    next(error);
  }
};

export const studentConsultationMiddlewares = {
  get: [auth, roles(["admin", "consultant", "finance-officer"]), getStudentWithRefs],
  create: [auth, roles(["admin", "consultant", "finance-officer"])],
  delete: [auth, roles(["admin", "consultant", "finance-officer"])],
  update: [auth, roles(["admin", "consultant", "finance-officer"])],
  getById: [auth, roles(["admin", "consultant", "finance-officer"])],
};
