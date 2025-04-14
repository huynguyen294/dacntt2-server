import jwt from "jsonwebtoken";

//[GET] /auth/new-access-token
export const generateNewAccessToken = async (req, res) => {
  const refreshToken = req.cookies.vocanote_rf_t;
  console.log({ refreshToken });

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log({ err });
        res.clearCookie("vocanote_rf_t");
        return res.status(401).json({ message: "Phiên đăng nhập hết hạn" });
      }

      const { email, id, userRole } = decoded;
      const newAccessToken = jwt.sign({ email, id, userRole }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      res.status(201).json({ newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống!" });
    console.log(error);
  }
};

//[GET] /auth/sign-out
export const signOut = async (req, res) => {};

//[POST] /auth/sign-in
export const signIn = async (req, res) => {};

//[POST] /auth/sign-up
export const signUp = async (req, res) => {};

//[POST] /auth/google-sign-in
export const googleSignIn = async (req, res) => {};
