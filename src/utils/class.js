import { addDays, format, startOfWeek, subDays } from "date-fns";
import { DATE_FORMAT } from "../constants/index.js";

export const getWeeks = (startDate, endDate) => {
  const weeks = [];
  while (startDate <= endDate) {
    let startWeek = startOfWeek(endDate, { weekStartsOn: 1 });
    weeks.push([format(startWeek, DATE_FORMAT), format(endDate, DATE_FORMAT)]);
    endDate = subDays(startWeek, 1);
  }

  return [...weeks].reverse();
};

export const getClassSchedule = (classData, req) => {
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
