import { classScheduleModel } from "../models/index.js";

// [GET] /class-schedules/by-class/:id
export const getClassSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await classScheduleModel.find({ classId: id }, null, req.order);
    res.status(200).json({ rows });
  } catch (error) {
    next(error);
  }
};
