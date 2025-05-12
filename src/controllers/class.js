import { classModel, courseModel, shiftModel, userModel } from "../models/index.js";
import { arrayToObject, transformQueryToFilterObject } from "../utils/index.js";
import { generateCRUD } from "./utils.js";

const commonCRUD = generateCRUD(classModel);

// [GET] /classes
const get = async (req, res, next) => {
  try {
    const { refs, refFields = "basic" } = req.query;
    const filterObj = transformQueryToFilterObject(req.query);

    if (refs !== "true") {
      const [rows, pager] = await classModel.find(filterObj, req.pager, req.order);
      return res.status(200).json({ rows, pager });
    }

    const [rows, pager] = await classModel.find(filterObj, req.pager, req.order);

    const refData = {};
    const [userIds, shiftIds, courseIds] = rows.reduce(
      (acc, row) => {
        if (row.teacherId) acc[0].push(row.teacherId);
        if (row.createdBy) acc[0].push(row.createdBy);
        if (row.shiftId) acc[1].push(row.shiftId);
        if (row.courseId) acc[2].push(row.courseId);
        return acc;
      },
      [[], [], []]
    );

    console.log(await shiftModel.getFields(refFields));
    const [[users], [shifts], [courses]] = await Promise.all([
      userModel.find({ id: userIds }, req.pager, null, userModel.getFields(refFields)),
      shiftModel.find({ id: shiftIds }, req.pager, null, shiftModel.getFields(refFields)),
      courseModel.find({ id: courseIds }, req.pager, null, courseModel.getFields(refFields)),
    ]);

    refData.users = arrayToObject(users, "id");
    refData.shifts = arrayToObject(shifts, "id");
    refData.courses = arrayToObject(courses, "id");

    res.status(200).json({ rows, pager, refs: refData });
  } catch (error) {
    next(error);
  }
};

const classController = { ...commonCRUD, get };

export default classController;
