import cloudinary from "../configs/cloudinary.js";
import { transformFields, transformQueryToFilterObject } from "../utils/index.js";
import nodemailer from "nodemailer";

const auth = { user: process.env.APP_EMAIL, pass: process.env.APP_EMAIL_PASSWORD };
const transporter = nodemailer.createTransport({ service: "gmail", auth });
export const sendMail = async ({ subject, html, email }) => {
  const mailOptions = { to: email, from: process.env.APP_EMAIL, subject, html };
  await transporter.sendMail(mailOptions, (error, info) => {
    console.log(error);
    if (error) throw new Error("Gửi mail thất bại");
  });
};

export const generateCRUD = (model, { isJunctionTable = false, searchFields = ["name"] } = {}) => {
  return {
    // [GET] ${model.tableName}/
    get: async (req, res, next) => {
      try {
        const filterObj = transformQueryToFilterObject(req.query, searchFields);
        const fields = model.getFields ? model.getFields(req.query.fields) : transformFields(req.query.fields);

        const [rows, pager] = await model.find(filterObj, req.pager, req.order, fields);
        res.status(200).json({ rows, pager });
      } catch (error) {
        next(error);
      }
    },

    // [POST] ${model.tableName}/
    create: async (req, res, next) => {
      try {
        const data = req.body;
        if (!Array.isArray(data[model.tableName])) {
          data.created_by = req.userId;
          if (!isJunctionTable) {
            data.last_updated_by = req.userId;
            data.last_updated_at = new Date();
          }

          const created = await model.create(data);
          return res.status(201).json({ created });
        }

        const transformed = data[model.tableName].map((d) => {
          d.created_by = req.userId;
          if (!isJunctionTable) {
            d.last_updated_at = new Date();
            d.last_updated_by = req.userId;
          }
          return d;
        });

        const created = await model.createMany(transformed);
        return res.status(201).json({ created });
      } catch (error) {
        next(error);
      }
    },

    // [GET] ${model.tableName}/:id
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

    // [PATCH] ${model.tableName}/:id
    update: async (req, res, next) => {
      const { id } = req.params;
      const data = req.body;

      try {
        if (!Array.isArray(data[model.tableName])) {
          if (!isJunctionTable) {
            data.last_updated_at = new Date();
            data.last_updated_by = req.userId;
          }

          const updated = await model.updateById(id, data);
          return res.status(201).json({ updated });
        }

        const transformed = data[model.tableName].map((d) => {
          if (!isJunctionTable) {
            d.last_updated_at = new Date();
            d.last_updated_by = req.userId;
          }
          return d;
        });

        const updated = await model.updateMany(transformed);
        return res.status(201).json({ updated });
      } catch (error) {
        next(error);
      }
    },

    // [DELETE] ${model.tableName}/:id
    delete: async (req, res, next) => {
      try {
        const { id } = req.params;
        const { ids } = req.query;

        if (id) {
          await model.delete(id);
          return res.status(201).json({ message: "Xóa thành công!" });
        }

        await model.deleteMany(ids.split(","));
        return res.status(201).json({ message: "Xóa thành công!" });
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
