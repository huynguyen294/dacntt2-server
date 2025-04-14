import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connect from "./configs/db/index.js";
import route from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config({ type: "module" });

const port = process.env.PORT || 5050;

const app = express();

connect();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
// app.use(cors({ origin: "https://vocanote.vercel.app", credentials: true }));

route(app);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
