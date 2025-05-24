import { classAttendanceModel } from "../models/index.js";

// [GET] /class-attendances/by-class/:id
export const getClassAttendances = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await classAttendanceModel.find({ classId: id }, null, req.order);
    res.status(200).json({ rows });
  } catch (error) {
    next(error);
  }
};
