import cloudinary from "../configs/cloudinary.js";

//[POST] /images
export const createImage = async (req, res, next) => {
  const { base64, folder = null } = req.body;

  try {
    console.time("upload");
    const result = await cloudinary.uploader.upload(base64, { folder });
    console.timeEnd("upload");
    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
};

//[PATCH] /images/:folder/:id
export const updateImage = async (req, res, next) => {
  const { folder, id } = req.params;
  const { base64 } = req.body;

  try {
    console.time("upload");
    const result = await cloudinary.uploader.upload(base64, { public_id: `${folder}/${id}`, overwrite: true });
    console.timeEnd("upload");
    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
};

//[DELETE] /images/:folder/:id
export const deleteImage = async (req, res, next) => {
  const { folder, id } = req.params;

  try {
    await cloudinary.uploader.destroy(`${folder}/${id}`);
    return res.status(200).json({ message: "Xóa ảnh thành công!" });
  } catch (error) {
    next(error);
  }
};
