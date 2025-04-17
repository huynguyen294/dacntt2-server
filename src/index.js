import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import route from "./routes/index.js";
import dotenv from "dotenv";
import createTables from "./models/createTables.js";
import { caseConverter, errorHandler } from "./middlewares/index.js";

dotenv.config({ type: "module" });

const port = process.env.PORT || 5050;

const app = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
// app.use(cors({ origin: "https://vocanote.vercel.app", credentials: true }));

// convert all body to snaked_case and res.json to camel case
app.use(caseConverter);

// routes
route(app);

// error handling
app.use(errorHandler);

// create pg tables if not exits
createTables();

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
