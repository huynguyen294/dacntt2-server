import userRoute from "./user.js";
import authRoute from "./auth.js";
import dbRoute from "./db.js";

const route = (app) => {
  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.use("/db", dbRoute);
  app.get("/", (req, res) => {
    res.status(404).send("Route not found!");
  });
};

export default route;
