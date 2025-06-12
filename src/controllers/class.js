import { auth } from "../middlewares/index.js";
import {
  classModel,
  classScheduleModel,
  courseModel,
  enrollmentModel,
  shiftModel,
  userModel,
} from "../models/index.js";
import { checkDuplicateForTeacher, generateClassSchedules } from "../utils/schedule.js";
import { arrayToObject, displayDate, transformQueryToFilterObject } from "../utils/index.js";

// [GET] /classes/:id/students
export const getClassStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { refFields = ":basic" } = req.query;
    const students = await classModel.findStudents([id], null, req.order, userModel.getFields(refFields));
    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};

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

    const [[users], [shifts], [courses], studentCounts] = await Promise.all([
      userModel.find({ id: { in: userIds } }, req.pager, null, userModel.getFields(refFields)),
      shiftModel.find({ id: { in: shiftIds } }, req.pager, null, shiftModel.getFields(refFields)),
      courseModel.find({ id: { in: courseIds } }, req.pager, null, courseModel.getFields(refFields)),
      enrollmentModel.countBy("classId", { classId: { in: classIds } }),
    ]);

    refData.users = arrayToObject(users, "id");
    refData.shifts = arrayToObject(shifts, "id");
    refData.courses = arrayToObject(courses, "id");
    refData.studentCounts = arrayToObject(studentCounts, "classId");

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

    const [teacher, course, studentCount] = await Promise.all([
      userModel.findById(item.teacherId, userModel.getFields(refFields)),
      courseModel.findOne({ id: item.courseId }, courseModel.getFields(refFields)),
      enrollmentModel.countBy("classId", { classId: id }),
    ]);

    res.status(200).json({
      item,
      refs: { studentCount: studentCount[0], teacher, course },
    });
  } catch (error) {
    next(error);
  }
};

// override create method
// [POST] /classes/
const createClassWithSchedules = async (req, res, next) => {
  try {
    const data = req.body;
    data.created_by = req.userId;
    data.last_updated_by = req.userId;
    data.last_updated_at = new Date();

    const created = await classModel.create(data);
    const schedules = generateClassSchedules(created, req);
    const schedulesCreated = await classScheduleModel.createMany(schedules);

    return res.status(201).json({ created, schedules: schedulesCreated });
  } catch (error) {
    next(error);
  }
};

// const dev = async (req, res, next) => {
//   try {
//     const [rows] = await classModel.find();

//     let acc = {};
//     for (const row of rows) {
//       const schedules = getClassSchedule(row, req);
//       const schedulesCreated = await classScheduleModel.createMany(schedules);
//       acc[row.name] = schedulesCreated;
//     }

//     return res.status(201).json({ acc });
//   } catch (error) {
//     next(error);
//   }
// };

const checkDuplicateScheduleBeforeCreate = async (req, res, next) => {
  try {
    const data = req.body;
    const teacherId = data.teacherId;
    const newSchedules = generateClassSchedules(data, req);
    const duplicated = await checkDuplicateForTeacher(teacherId, newSchedules);
    if (!duplicated) return next();

    const message = `Giáo viên trùng lịch ngày ${displayDate(duplicated.date)}`;
    return res.status(400).json({ message, duplicated });
  } catch (error) {
    next(error);
  }
};

const checkDuplicateScheduleBeforeUpdate = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teacherId = req.body.teacherId;
    const [newTeacherSchedules] = await classScheduleModel.find({ classId: id });
    const duplicated = await checkDuplicateForTeacher(teacherId, newTeacherSchedules);

    return res.json({ duplicated });
    if (!duplicated) return next();

    const message = `Giáo viên trùng lịch ngày ${displayDate(duplicated.date)}`;
    return res.status(400).json({ message, duplicated });
  } catch (error) {
    next(error);
  }
};

export const classMiddleWares = {
  get: [auth, getClassWithRefs],
  create: [auth, createClassWithSchedules],
  delete: [auth],
  update: [auth],
  getById: [auth, getClassByIdWithRefs],
};
