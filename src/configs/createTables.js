import fs from "fs";
import pgDB from "./db.js";

const createTables = () => {
  const query = fs.readFileSync("./src/configs/createTables.sql", "utf8");

  try {
    pgDB.query(query);
  } catch (error) {
    console.log(error);
  }
};

export default createTables;
