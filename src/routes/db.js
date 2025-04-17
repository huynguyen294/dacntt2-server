import express from "express";
import pgDB from "../configs/db.js";

const dbRoute = express.Router();

// test pbDB connect
dbRoute.get("/", async (req, res) => {
  const result = await pgDB.query("SELECT current_database()");
  res.send("Database connected: " + result.rows[0].current_database);
});

export default dbRoute;
