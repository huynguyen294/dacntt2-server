import cloudinary from "../configs/cloudinary.js";
import { transformQueryToFilterObject } from "../utils/index.js";

export const generateCRUD = (model, isJunctionTable = false) => {
  return {
    get: async (req, res, next) => {
      try {
        const filterObj = transformQueryToFilterObject(req.query, ["name"]);

        const [rows, pager] = await model.find(filterObj, req.pager, req.order);
        res.status(200).json({ rows, pager });
      } catch (error) {
        next(error);
      }
    },
    create: async (req, res, next) => {
      try {
        const data = req.body;
        if (!isJunctionTable) {
          data.created_by = req.userId;
          data.last_updated_at = new Date();
          data.last_updated_by = req.userId;
        }

        const created = await model.create(data);
        res.status(201).json({ created });
      } catch (error) {
        next(error);
      }
    },
    getById: async (req, res, next) => {
      const { id } = req.params;

      try {
        const item = await model.findById(id);
        if (!item) return res.status(404).json({ message: "Không tìm thấy kết quả!" });
        res.status(201).json({ item });
      } catch (error) {
        next(error);
      }
    },
    update: async (req, res, next) => {
      const { id } = req.params;
      const data = req.body;

      if (!isJunctionTable) {
        data.last_updated_at = new Date();
        data.last_updated_by = req.userId;
      }

      try {
        const updated = await model.updateById(id, data);
        res.status(201).json({ updated });
      } catch (error) {
        next(error);
      }
    },
    delete: async (req, res, next) => {
      const { id } = req.params;

      try {
        await model.delete(id);
        res.status(201).json({ message: "Xóa ca học thành công!" });
      } catch (error) {
        next(error);
      }
    },
  };
};

export const uploadImage = async (base64, folder, public_id = null, overwrite = false) => {
  const result = await cloudinary.uploader.upload(base64, { folder, public_id, overwrite });
  return result.secure_url;
};

export const deleteImage = (folder, publicId) => cloudinary.uploader.destroy(`${folder}/${publicId}`);
