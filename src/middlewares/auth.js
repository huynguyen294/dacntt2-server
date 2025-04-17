import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    //jwt token
    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decodedData?.id;
    req.userRole = decodedData?.userRole;
    req.email = decodedData?.email;

    next();
  } catch (error) {
    console.log(error.stack);
    return res.status(401).json({ message: "Phiên đăng nhập hết hạn" });
  }
};

export default auth;
