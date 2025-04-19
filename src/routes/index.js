import userRoute from "./user.js";
import authRoute from "./auth.js";
import dbRoute from "./db.js";

const route = (app) => {
  app.use("/api-v1/auth", authRoute);
  app.use("/api-v1/users", userRoute);
  app.use("/api-v1/db", dbRoute);
  app.get("/api-v1/", (req, res, next) => {
    res.status(404).send("Route not found!");
  });
  app.get("/", (req, res, next) => {
    res.status(404).send("Route not found!");
  });
};

export default route;
