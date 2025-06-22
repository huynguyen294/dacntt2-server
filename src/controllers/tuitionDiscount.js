import { auth } from "../middlewares/index.js";
import { classModel, tuitionDiscountModel, userModel } from "../models/index.js";
import { arrayToObject, transformQueryToFilterObject } from "../utils/index.js";

export const getWithRefs = async (req, res, next) => {
  try {
    const { refs } = req.query;
    if (refs !== "true") return next();
    const { refFields = ":basic" } = req.query;
    const filterObj = transformQueryToFilterObject(req.query, ["id", "reason"], tuitionDiscountModel.tableName);
    const [rows, pager] = await tuitionDiscountModel.find(filterObj, req.pager, req.order);

    const refData = {};
    const [userIds, classIds] = rows.reduce(
      (acc, row) => {
        if (row.studentId) acc[0].push(row.studentId);
        if (row.createdBy) acc[0].push(row.createdBy);
        if (row.updatedBy) acc[0].push(row.updatedBy);
        if (row.classId) acc[1].push(row.classId);
        return acc;
      },
      [[], []]
    );

    const [[users], [classes]] = await Promise.all([
      userModel.find({ id: { in: userIds } }, req.pager, null, userModel.getFields(refFields)),
      classModel.find({ id: { in: classIds } }, req.pager, null, classModel.getFields(refFields)),
    ]);

    refData.users = arrayToObject(users);
    refData.classes = arrayToObject(classes);

    res.status(200).json({ rows, pager, refs: refData });
  } catch (error) {
    next(error);
  }
};

export const tuitionDiscountMiddleWares = {
  get: [auth, getWithRefs],
};
