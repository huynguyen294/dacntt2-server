import { addDays, format, startOfWeek, subDays } from "date-fns";
import { DATE_FORMAT } from "../constants/index.js";
import { classScheduleModel, shiftModel } from "../models/index.js";
import { arrayToObject } from "./index.js";

const toHours = (time) => new Date().setHours(...time.split(":").map((t) => Number(t)));

const findDuplicateSchedule = (currentSchedules, newSchedules, shiftObj) => {
  const foundDuplicate = currentSchedules.find((cSchedule) => {
    const cFormattedDate = format(cSchedule.date, DATE_FORMAT);
    const cShift = shiftObj[cSchedule.shiftId];
    const cShiftStartTime = toHours(cShift.startTime);
    const cShiftEndTime = toHours(cShift.endTime);

    const found = newSchedules.find((nSchedule) => {
      const nFormattedDate = format(nSchedule.date, DATE_FORMAT);
      const nShift = shiftObj[nSchedule.shiftId];
      const nShiftStartTime = toHours(nShift.startTime);
      const nShiftEndTime = toHours(nShift.endTime);

      let valid = true;
      if (
        cFormattedDate === nFormattedDate &&
        ((cShiftStartTime > nShiftStartTime && cShiftStartTime < nShiftEndTime) ||
          (cShiftEndTime > nShiftStartTime && cShiftEndTime < nShiftEndTime))
      ) {
        valid = false;
      }

      return !valid;
    });

    return Boolean(found);
  });

  return foundDuplicate;
};

export const checkDuplicateForStudent = async (studentId, newSchedules = []) => {
  const [studentSchedules, [shifts]] = await Promise.all([
    classScheduleModel.getByStudents([studentId]),
    shiftModel.find(),
  ]);

  const shiftObj = arrayToObject(shifts);
  return findDuplicateSchedule(studentSchedules, newSchedules, shiftObj);
};

export const checkDuplicateForTeacher = async (teacherId, newSchedules = []) => {
  const [[teacherSchedules], [shifts]] = await Promise.all([classScheduleModel.find({ teacherId }), shiftModel.find()]);
  const shiftObj = arrayToObject(shifts);
  return findDuplicateSchedule(teacherSchedules, newSchedules, shiftObj);
};

export const getWeeks = (startDate, endDate) => {
  const weeks = [];
  while (startDate <= endDate) {
    let startWeek = startOfWeek(endDate, { weekStartsOn: 1 });
    weeks.push([format(startWeek, DATE_FORMAT), format(endDate, DATE_FORMAT)]);
    endDate = subDays(startWeek, 1);
  }

  return [...weeks].reverse();
};

export const generateClassSchedules = (classData, req) => {
  const { openingDay, closingDay, numberOfLessons, weekDays, shiftId, teacherId, id } = classData;

  const startDate = new Date(openingDay);
  const endDate = new Date(closingDay);

  const weeks = getWeeks(startDate, endDate);
  const days = weekDays.split(",");

  return weeks.reduce((acc, [startWeek, endWeek]) => {
    const startWeekDate = new Date(startWeek);
    const endWeekDate = new Date(endWeek);

    days.forEach((day) => {
      if (acc.length >= numberOfLessons) return acc;

      const date = addDays(startWeekDate, day === "CN" ? 5 : Number(day) - 2);
      if (date < startDate) return;

      if (date >= startWeekDate && date <= endWeekDate) {
        const data = { date: format(date, DATE_FORMAT), shiftId, teacherId, classId: id };
        data.created_by = req.userId;
        data.last_updated_by = req.userId;
        data.last_updated_at = new Date();
        acc.push(data);
      }
    });

    return acc;
  }, []);
};
