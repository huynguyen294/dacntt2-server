import dbRoute from "./db.js";
import userRoute from "./user.js";
import authRoute from "./auth.js";
import courseRoute from "./course.js";

const route = (app) => {
  app.use("/api-v1/auth", authRoute);
  app.use("/api-v1/users", userRoute);
  app.use("/api-v1/courses", courseRoute);
  app.use("/api-v1/db", dbRoute);
  app.use((req, res, next) => {
    res.status(404).json({ message: "Không tìm thấy đường dẫn!" });
  });
};

export default route;
