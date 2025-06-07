import { auth, roles } from "../middlewares/index.js";
import { enrollmentModel } from "../models/index.js";

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

    const created = await enrollmentModel.createMany(transformed, ["studentId", "classId"]);
    return res.status(201).json({ created });
  } catch (error) {
    next(error);
  }
};

export const enrollmentMiddleWares = {
  get: [auth],
  create: [auth, roles(["admin", "consultant", "finance-officer"]), createManyEnrollment],
  delete: [auth, roles(["admin", "consultant", "finance-officer"])],
  update: [auth, roles(["admin", "consultant", "finance-officer"])],
  getById: [auth, roles(["admin", "consultant", "finance-officer"])],
};
