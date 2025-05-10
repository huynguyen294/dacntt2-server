import { shiftModel } from "../models/index.js";
import { transformQueryToFilterObject } from "../utils/index.js";

//[GET] /shifts
export const getShifts = async (req, res, next) => {
  try {
    const filterObj = transformQueryToFilterObject(req.query, ["name"]);

    const [rows, pager] = await shiftModel.find(filterObj, req.pager, req.order);
    res.status(200).json({ shifts: rows, pager });
  } catch (error) {
    next(error);
  }
};

//[POST] /shifts
export const createShift = async (req, res, next) => {
  try {
    const data = req.body;
    data.created_by = req.userId;
    const newShift = await shiftModel.create(data);
    res.status(201).json({ newShift });
  } catch (error) {
    next(error);
  }
};

//[GET] /shifts/:id
export const getShiftById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const shift = await shiftModel.findById(id);
    if (!shift) return res.status(404).json({ message: "Không tìm thấy ca học!" });
    res.status(201).json({ shift });
  } catch (error) {
    next(error);
  }
};

//[PATCH] /shifts/:id
export const updateShift = async (req, res, next) => {
  const { id } = req.params;
  const newShift = req.body;
  newShift.last_updated_at = new Date();
  newShift.last_updated_by = req.userId;

  try {
    const updatedShift = await shiftModel.updateById(id, newShift);
    res.status(201).json({ updatedShift });
  } catch (error) {
    next(error);
  }
};

//[DELETE] /shifts/:id
export const deleteShift = async (req, res, next) => {
  const { id } = req.params;

  try {
    await shiftModel.delete(id);
    res.status(201).json({ message: "Xóa ca học thành công!" });
  } catch (error) {
    next(error);
  }
};
