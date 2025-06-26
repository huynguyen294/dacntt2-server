import { endOfMonth, format, startOfMonth } from "date-fns";
import { classModel, enrollmentModel, studentConsultationModel, tuitionModel } from "../models/index.js";
import { DATE_FORMAT } from "../constants/index.js";
import { calcTotal, getPreviousMonth } from "../utils/index.js";

// [GET] /reports/student-indicator
export const studentIndicator = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const previousMonth = getPreviousMonth();
    const previous2Month = getPreviousMonth(previousMonth);
    const startDate = startOfMonth(new Date(currentYear, previousMonth));
    const endDate = endOfMonth(new Date(currentYear, previousMonth));
    const startDate2 = startOfMonth(new Date(currentYear, previous2Month));
    const endDate2 = endOfMonth(new Date(currentYear, previous2Month));

    const [[previousMonthValue], [previous2MonthValue]] = await Promise.all([
      enrollmentModel.countBy(null, {
        createdAt: { lte: format(endDate, DATE_FORMAT), gte: format(startDate, DATE_FORMAT) },
      }),
      enrollmentModel.countBy(null, {
        createdAt: { lte: format(endDate2, DATE_FORMAT), gte: format(startDate2, DATE_FORMAT) },
      }),
    ]);

    res.status(200).json({
      previousMonthValue: Number(previousMonthValue.total),
      previous2MonthValue: Number(previous2MonthValue.total),
    });
  } catch (error) {
    next(error);
  }
};

// [GET] /reports/total-student
export const getTotalStudent = async (req, res, next) => {
  try {
    const [{ total }] = await enrollmentModel.allStudents();
    res.status(200).json({ total });
  } catch (error) {
    next(error);
  }
};

// [GET] /reports/classes
export const getTotalStudentByClasses = async (req, res, next) => {
  try {
    const totals = await enrollmentModel.allStudentByClasses();
    res.status(200).json({ totals });
  } catch (error) {
    next(error);
  }
};

// [GET] /reports/enrollment-per-months
export const getEnrollmentsPerMonth = async (req, res, next) => {
  try {
    const enrollmentsPerMonth = await enrollmentModel.enrollmentsPerMonth(new Date().getFullYear());
    res.status(200).json({ enrollmentsPerMonth });
  } catch (error) {
    next(error);
  }
};

// [GET] /reports/tuition-per-months
export const getTuitionsPerMonth = async (req, res, next) => {
  try {
    const tuitionsPerMonth = await tuitionModel.tuitionsPerMonth(new Date().getFullYear());
    res.status(200).json({ tuitionsPerMonth });
  } catch (error) {
    next(error);
  }
};

// [GET] /reports/admission-per-months
export const getAdmissionsPerMonth = async (req, res, next) => {
  try {
    const admissionsPerMonth = await studentConsultationModel.admissionsPerMonth(new Date().getFullYear());
    res.status(200).json({ admissionsPerMonth });
  } catch (error) {
    next(error);
  }
};

// [GET] /reports/class-indicator
export const classIndicator = async (req, res, next) => {
  try {
    const [[active], [pending]] = await Promise.all([
      classModel.countBy(null, {
        openingDay: { lte: format(new Date(), DATE_FORMAT) },
        closingDay: { gte: format(new Date(), DATE_FORMAT) },
      }),
      classModel.countBy(null, {
        openingDay: { gte: format(new Date(), DATE_FORMAT) },
      }),
    ]);

    res.status(200).json({
      active: Number(active.total),
      pending: Number(pending.total),
    });
  } catch (error) {
    next(error);
  }
};

// [GET] /reports/tuition-indicator
export const tuitionIndicator = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const previousMonth = getPreviousMonth();
    const previous2Month = getPreviousMonth(previousMonth);
    const startDate = startOfMonth(new Date(currentYear, previousMonth));
    const endDate = endOfMonth(new Date(currentYear, previousMonth));
    const startDate2 = startOfMonth(new Date(currentYear, previous2Month));
    const endDate2 = endOfMonth(new Date(currentYear, previous2Month));

    const [[previous], [previous2]] = await Promise.all([
      tuitionModel.find({
        date: { lte: format(endDate, DATE_FORMAT), gte: format(startDate, DATE_FORMAT) },
      }),
      tuitionModel.find({
        date: { lte: format(endDate2, DATE_FORMAT), gte: format(startDate2, DATE_FORMAT) },
      }),
    ]);

    res.status(200).json({
      previousMonthValue: calcTotal(previous, "amount"),
      previous2MonthValue: calcTotal(previous2, "amount"),
    });
  } catch (error) {
    next(error);
  }
};
