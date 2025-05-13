import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userModel } from "../models/index.js";

//[GET] /auth/new-access-token
export const generateNewAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.dacntt1_rf_t;

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log({ err });
        res.clearCookie("dacntt1_rf_t");
        return res.status(401).json({ message: "Phiên đăng nhập hết hạn" });
      }

      const { email, id, userRole } = decoded;
      const newAccessToken = jwt.sign({ email, id, userRole }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      res.status(200).json({ newAccessToken });
    });
  } catch (error) {
    next(error, req, res, next);
  }
};

//[GET] /auth/sign-out
export const signOut = async (req, res, next) => {
  res.clearCookie("dacntt1_rf_t");
  res.sendStatus(204);
};

//[POST] /auth/sign-in
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email chưa đăng ký." });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Mật khẩu không chính xác." });

    const { id, role } = user;
    const payload = { email, id, userRole: role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

    // Gửi refresh token qua HTTP-only cookie
    res.cookie("dacntt1_rf_t", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({ user, accessToken });
  } catch (error) {
    console.log(error);
    next(error, req, res, next);
  }
};

//[POST] /auth/google-sign-in
export const googleSignIn = async (req, res, next) => {};
