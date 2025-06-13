import { auth, roles } from "../middlewares/index.js";
import { enrollmentModel } from "../models/index.js";
import { displayDate, displayDay } from "../utils/index.js";
import { checkDuplicateForStudent } from "../utils/schedule.js";

// [POST] /enrollments
// body = enrollments=[]

const createManyEnrollment = async (req, res, next) => {
  if (!req.body.enrollments?.length) return next();

  try {
    let transformed = req.body.enrollments.map((d) => {
      d.created_by = req.userId;
      d.last_updated_at = new Date();
      d.last_updated_by = req.userId;
      return d;
    });

    const result = await Promise.all(
      transformed.map(async (data) => {
        const { studentId, classId } = data;
        const duplicated = await checkDuplicateForStudent(studentId, classId);
        if (duplicated) return { duplicated, studentId };
        const created = await enrollmentModel.create(data);
        return { created };
      })
    );

    const [created, duplicated] = result.reduce(
      (acc, curr) => {
        if (curr.created) acc[0].push(curr);
        if (curr.duplicated) acc[1].push(curr);
        return acc;
      },
      [[], []]
    );

    return res.status(200).json({ created, duplicated });
  } catch (error) {
    next(error);
  }
};

const checkScheduleBeforeCreateOne = async (req, res, next) => {
  try {
    const { studentId, classId } = req.body;
    const duplicated = await checkDuplicateForStudent(studentId, classId);
    if (!duplicated) return next();

    const message = `Học viên trùng lịch ${displayDay(duplicated.date)} ngày ${displayDate(duplicated.date)}`;
    return res.status(400).json({ message, duplicated });
  } catch (error) {
    next(error);
  }
};

export const enrollmentMiddleWares = {
  get: [auth],
  create: [auth, roles(["admin", "consultant", "finance-officer"]), createManyEnrollment, checkScheduleBeforeCreateOne],
  delete: [auth, roles(["admin", "consultant", "finance-officer"])],
  update: [auth, roles(["admin", "consultant", "finance-officer"])],
  getById: [auth, roles(["admin", "consultant", "finance-officer"])],
};
