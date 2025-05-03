import { classModel } from "../models/index.js";
import { transformQueryToFilterObject } from "../utils/index.js";

//[GET] /classes
export const getClasses = async (req, res, next) => {
  try {
    const filterObj = transformQueryToFilterObject(req.query);

    const [rows, pager] = await classModel.find(filterObj, { pager: req.pager, order: req.order });
    res.status(201).json({ classes: rows, pager });
  } catch (error) {
    next(error);
  }
};

//[POST] /classes
export const createClass = async (req, res, next) => {
  try {
    const data = req.body;
    data.created_by = req.userId;
    const newClass = await classModel.create(data);
    res.status(201).json({ newClass });
  } catch (error) {
    next(error);
  }
};

//[GET] /classes/:id
export const getClassById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const _class = await classModel.findById(id);
    if (!_class) return res.status(404).json({ message: "Không tìm thấy lớp học!" });
    res.status(201).json({ class: _class });
  } catch (error) {
    next(error);
  }
};

//[PATCH] /classes/:id
export const updateClass = async (req, res, next) => {
  const { id } = req.params;
  const newClass = req.body;
  newClass.last_updated_at = new Date();
  newClass.last_updated_by = req.userId;

  try {
    const updatedClass = await classModel.updateById(id, newClass);
    res.status(201).json({ updatedClass });
  } catch (error) {
    next(error);
  }
};

//[DELETE] /classes/:id
export const deleteClass = async (req, res, next) => {
  const { id } = req.params;

  try {
    await classModel.delete(id);
    res.status(201).json({ message: "Xóa lớp học thành công!" });
  } catch (error) {
    next(error);
  }
};
