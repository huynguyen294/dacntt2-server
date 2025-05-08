import cloudinary from "../configs/cloudinary.js";

export const generateCRUD = (model) => {
  return {
    create: (req, res) => {},
  };
};

export const uploadImage = async (base64, folder, public_id = null, overwrite = false) => {
  const result = await cloudinary.uploader.upload(base64, { folder, public_id, overwrite });
  return result.secure_url;
};

export const deleteImage = (folder, publicId) => cloudinary.uploader.destroy(`${folder}/${publicId}`);
