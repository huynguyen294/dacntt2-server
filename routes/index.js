import userRoute from "./user.js";
import authRoute from "./auth.js";

const route = (app) => {
  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.get("/", (req, res) => {
    res.send("DACNTT2 Server!");
  });
};

export default route;
