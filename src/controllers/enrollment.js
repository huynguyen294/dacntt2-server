import { enrollmentModel } from "../models/index.js";
import { transformQueryToFilterObject } from "../utils/index.js";

//[GET] /courses
export const getEnrollments = async (req, res, next) => {
  try {
    const filterObj = transformQueryToFilterObject(req.query);

    const [rows, pager] = await enrollmentModel.find(filterObj, req.pager, req.order);
    res.status(201).json({ courses: rows, pager });
  } catch (error) {
    next(error);
  }
};

//[POST] /courses
export const createEnrollment = async (req, res, next) => {
  try {
    const data = req.body;
    data.created_by = req.userId;
    const newEnrollment = await enrollmentModel.create(data);
    res.status(201).json({ newEnrollment });
  } catch (error) {
    next(error);
  }
};

//[GET] /courses/:id
export const getEnrollmentById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const course = await enrollmentModel.findById(id);
    if (!course) return res.status(404).json({ message: "Không tìm thấy đăng ký lớp!" });
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
};

//[PATCH] /courses/:id
export const updateEnrollment = async (req, res, next) => {
  const { id } = req.params;
  const newEnrollment = req.body;
  newEnrollment.last_updated_at = new Date();
  newEnrollment.last_updated_by = req.userId;

  try {
    const updatedEnrollment = await enrollmentModel.updateById(id, newEnrollment);
    res.status(201).json({ updatedEnrollment });
  } catch (error) {
    next(error);
  }
};

//[DELETE] /courses/:id
export const deleteEnrollment = async (req, res, next) => {
  const { id } = req.params;

  try {
    await enrollmentModel.delete(id);
    res.status(201).json({ message: "Xóa đăng ký lớp thành công!" });
  } catch (error) {
    next(error);
  }
};
