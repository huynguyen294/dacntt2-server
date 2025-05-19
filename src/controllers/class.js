import groupBy from "lodash/groupBy.js";
import { auth, roles } from "../middlewares/index.js";
import { classModel, courseModel, enrollmentModel, shiftModel, userModel } from "../models/index.js";
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
    const [userIds, shiftIds, courseIds, classIds] = rows.reduce(
      (acc, row) => {
        if (row.teacherId) acc[0].push(row.teacherId);
        if (row.createdBy) acc[0].push(row.createdBy);
        if (row.shiftId) acc[1].push(row.shiftId);
        if (row.courseId) acc[2].push(row.courseId);
        acc[3].push(row.id);
        return acc;
      },
      [[], [], [], []]
    );

    const [[users], [shifts], [courses], students] = await Promise.all([
      userModel.find({ id: { in: userIds } }, req.pager, null, userModel.getFields(refFields)),
      shiftModel.find({ id: { in: shiftIds } }, req.pager, null, shiftModel.getFields(refFields)),
      courseModel.find({ id: { in: courseIds } }, req.pager, null, courseModel.getFields(refFields)),
      classModel.findStudents(classIds, req.pager, null, userModel.getFields(refFields)),
    ]);

    refData.users = arrayToObject(users, "id");
    refData.shifts = arrayToObject(shifts, "id");
    refData.courses = arrayToObject(courses, "id");
    refData.students = groupBy(students, "classId");

    res.status(200).json({ rows, pager, refs: refData });
  } catch (error) {
    next(error);
  }
};

// [GET] /classes/:id?refs=true
const getClassByIdWithRefs = async (req, res, next) => {
  try {
    const { refs } = req.query;
    if (refs !== "true") return next();

    const { id } = req.params;
    const { refFields = ":basic" } = req.query;
    const item = await classModel.findById(id);

    if (!item) return res.status(404).json({ message: "Không tìm thấy kết quả!" });

    const [enrolls] = await enrollmentModel.find({ classId: id }, null, null);
    const [studentIds, enrollmentIds] = enrolls.reduce(
      (acc, s) => [acc[0].concat(s.studentId), acc[1].concat(s.id)],
      [[], []]
    );

    const [teacher, [students], course] = await Promise.all([
      userModel.findById(item.teacherId, userModel.getFields(refFields)),
      userModel.find({ id: { in: studentIds } }, null, null, userModel.getFields(refFields)),
      courseModel.findOne({ id: item.courseId }, courseModel.getFields(refFields)),
    ]);

    res.status(200).json({
      item,
      refs: { students: students.map((s, index) => ({ ...s, enrollmentId: enrollmentIds[index] })), teacher, course },
    });
  } catch (error) {
    next(error);
  }
};

export const classMiddleWares = {
  get: [auth, getClassWithRefs],
  create: [auth],
  delete: [auth],
  update: [auth],
  getById: [auth, getClassByIdWithRefs],
};
