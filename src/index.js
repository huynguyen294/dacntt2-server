import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import route from "./routes/index.js";
import dotenv from "dotenv";
import createTables from "./configs/createTables.js";
import swaggerUi from "swagger-ui-express";
// import generateDummyUser from "./scripts/generateDummyUser.js";
import openApiDocument from "./docs/openapi.js";
import zodToOpenapi from "@asteasolutions/zod-to-openapi";
import { errorHandler, pagerAndOrder } from "./middlewares/index.js";
import { z } from "zod";
const { extendZodWithOpenApi } = zodToOpenapi;
extendZodWithOpenApi(z);

dotenv.config({ type: "module" });

const port = process.env.PORT || 5050;

const app = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));

// handle pager and order
app.use(pagerAndOrder);

// Swagger UI route
app.use("/api-v1/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// routes
route(app);

// error handling
app.use(errorHandler);

// create pg tables if not exits
createTables();

// generateDummyUser();

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
