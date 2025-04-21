import pgDB from "../configs/db.js";
import fs from "fs";

const createTables = () => {
  const query = fs.readFileSync("./src/models/createTables.sql", "utf8");

  try {
    pgDB.query(query);
  } catch (error) {
    console.log(error);
  }
};

export default createTables;
