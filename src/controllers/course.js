import { courseModel } from "../models/index.js";
import { transformQueryToFilterObject } from "../utils/index.js";

//[GET] /courses
export const getCourses = async (req, res, next) => {
  try {
    const filterObj = transformQueryToFilterObject(req.query, ["name"]);

    const [rows, pager] = await courseModel.find(filterObj, req.pager, req.order);
    res.status(200).json({ courses: rows, pager });
  } catch (error) {
    next(error);
  }
};

//[POST] /courses
export const createCourse = async (req, res, next) => {
  try {
    const data = req.body;
    data.created_by = req.userId;
    const newCourse = await courseModel.create(data);
    res.status(201).json({ newCourse });
  } catch (error) {
    next(error);
  }
};

//[GET] /courses/:id
export const getCourseById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const course = await courseModel.findById(id);
    if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học!" });
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
};

//[PATCH] /courses/:id
export const updateCourse = async (req, res, next) => {
  const { id } = req.params;
  const newCourse = req.body;
  newCourse.last_updated_at = new Date();
  newCourse.last_updated_by = req.userId;

  try {
    const updatedCourse = await courseModel.updateById(id, newCourse);
    res.status(201).json({ updatedCourse });
  } catch (error) {
    next(error);
  }
};

//[DELETE] /courses/:id
export const deleteCourse = async (req, res, next) => {
  const { id } = req.params;

  try {
    await courseModel.delete(id);
    res.status(201).json({ message: "Xóa khóa học thành công!" });
  } catch (error) {
    next(error);
  }
};
