import { certificateModel } from "../models/index.js";
import { transformQueryToFilterObject } from "../utils/index.js";

//[GET] /certificates
export const getCertificates = async (req, res, next) => {
  try {
    const filterObj = transformQueryToFilterObject(req.query);

    const [rows, pager] = await certificateModel.find(filterObj, req.pager, req.order);
    res.status(201).json({ certificates: rows, pager });
  } catch (error) {
    next(error);
  }
};

//[POST] /certificates
export const createCertificate = async (req, res, next) => {
  try {
    const data = req.body;
    data.created_by = req.userId;
    const newCertificate = await certificateModel.create(data);
    res.status(201).json({ newCertificate });
  } catch (error) {
    next(error);
  }
};

//[GET] /certificates/:id
export const getCertificateById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const course = await certificateModel.findById(id);
    if (!course) return res.status(404).json({ message: "Không tìm thấy chứng chỉ!" });
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
};

//[PATCH] /certificates/:id
export const updateCertificate = async (req, res, next) => {
  const { id } = req.params;
  const newCertificate = req.body;
  newCertificate.last_updated_at = new Date();
  newCertificate.last_updated_by = req.userId;

  try {
    const updatedCertificate = await certificateModel.updateById(id, newCertificate);
    res.status(201).json({ updatedCertificate });
  } catch (error) {
    next(error);
  }
};

//[DELETE] /certificates/:id
export const deleteCertificate = async (req, res, next) => {
  const { id } = req.params;

  try {
    await certificateModel.delete(id);
    res.status(201).json({ message: "Xóa chứng chỉ thành công!" });
  } catch (error) {
    next(error);
  }
};
