import pgDB from "../configs/db.js";
import { convertToCamelShallow, convertToSnakeShallow } from "../utils/index.js";

export const generateCommonServices = (tableName) => {
  // generatePager
  const generatePager = async (filter = {}, pager) => {
    if (!pager) return [null, ""];
    const { page, page_size } = pager;

    const query = `SELECT COUNT(*) FROM ${tableName}`;
    const { filterStr, values } = generateFilterString(filter);
    const finalQuery = query + filterStr;

    console.log("generatePager", finalQuery);
    const result = await pgDB.query(finalQuery, values);
    const total = Number(result.rows[0].count);
    const page_count = Math.ceil(total / page_size);
    const pagerGenerated = { total, page_count, page, page_size };
    const pagerStr = ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    return [pagerGenerated, pagerStr];
  };

  // generate order
  const generateOrderStr = ({ order, order_by }) => ` ORDER BY ${order_by} ${order} `;

  return {
    create: keyConvertWrapper(async (data) => {
      const fields = Object.keys(data);
      const fieldsStr = fields.join(", ");
      const valuesStr = fields.map((f, index) => "$" + (index + 1));

      const query = `INSERT INTO ${tableName} (${fieldsStr}) VALUES (${valuesStr}) RETURNING *`;
      const values = fields.map((f) => data[f] || null);
      console.log("create:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    }),

    updateById: keyConvertWrapper(async (id, newData) => {
      const fields = Object.keys(newData);

      const valuesStr = fields.map((f, index) => `${f} = $${index + 1}`).join(", ");
      const values = fields.map((f) => newData[f] || null);
      values.push(id);

      const query = `UPDATE ${tableName} SET ${valuesStr} WHERE id = $${values.length} RETURNING *`;
      console.log("updateById:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    }),

    delete: keyConvertWrapper(async (id) => {
      const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
      const values = [id];
      console.log("delete:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    }),

    find: keyConvertWrapper(async (filter = {}, pager, order) => {
      const [pagerGenerated, pagerStr] = await generatePager(filter, pager);
      const orderStr = generateOrderStr(order);

      const query = `SELECT * FROM ${tableName}`;
      const { filterStr, values } = generateFilterString(filter, pager);
      const finalQuery = query + filterStr + orderStr + pagerStr;

      if (pagerStr) {
        values.push(pager.page_size);
        const offset = (pager.page - 1) * pager.page_size;
        values.push(offset);
      }

      console.log("find:", finalQuery, values);
      const result = await pgDB.query(finalQuery, values);
      return [result.rows, pagerGenerated];
    }),

    findOne: keyConvertWrapper(async (filter = {}) => {
      const query = `SELECT * FROM ${tableName}`;
      const { filterStr, values } = generateFilterString(filter);
      const finalQuery = query + filterStr + " LIMIT 1";

      console.log("findOne:", finalQuery);
      const result = await pgDB.query(finalQuery, values);
      return result.rows[0] ?? null;
    }),

    exists: keyConvertWrapper(async (filter) => {
      const query = `SELECT 1 FROM ${tableName}`;
      const { filterStr, values } = generateFilterString(filter);
      let finalQuery = query + filterStr;

      finalQuery = `SELECT 1 WHERE EXISTS (${finalQuery})`;
      console.log("findOne:", finalQuery);
      const result = await pgDB.query(finalQuery, values);
      return Boolean(result.rows[0]);
    }),

    findById: keyConvertWrapper(async (id) => {
      const query = `SELECT * FROM ${tableName} WHERE id = $1`;
      const values = [id];
      console.log("findById:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0] ?? null;
    }),
  };
};

const generateSearchString = (values, filterStr, searchValue) => {
  let currentFilterStr = filterStr;

  // search and case
  if (!Array.isArray(searchValue)) {
    const searchAndConditions = Object.keys(searchValue)
      .map((searchField) => {
        values.push(searchValue[searchField]);
        return `${searchField} ILIKE $${values.length}`;
      })
      .join(" AND ");
    currentFilterStr += `(${searchAndConditions})`;
    return currentFilterStr;
  }

  // search or case
  const searchOrConditions = searchValue
    .map((searchValueObj) => generateSearchString(values, currentFilterStr, searchValueObj))
    .join(" OR ");
  currentFilterStr += `(${searchOrConditions})`;
  return currentFilterStr;
};

const generateFilterString = (filter) => {
  const values = [];
  let filterStr = "";

  if (Object.values(filter).filter(Boolean).length === 0) return { filterStr, values };

  filterStr = " WHERE ";
  Object.keys(filter).forEach((field) => {
    let value = filter[field];
    let operator = "=";

    // handle search
    if (field === "search") {
      // Add AND if not the first condition
      // Add AND if not the first condition
      if (values.length > 0) currentFilterStr += " AND ";
      filterStr += generateSearchString(values, "", value);
    }
    // Handle array condition
    else if (Array.isArray(value)) {
      // Add AND if not the first condition
      if (values.length > 0) filterStr += " AND ";

      const orConditions = value
        .map((val, idx) => {
          values.push(val);
          return `${field} = $${values.length}`;
        })
        .join(" OR ");
      filterStr += `(${orConditions})`;
    }
    // Handle operator
    else {
      // Add AND if not the first condition
      if (values.length > 0) filterStr += " AND ";

      if (typeof value === "object" && value !== null) {
        const [opKey] = Object.keys(value);
        operator = MAP_OPERATORS[opKey] || "=";
        value = value[opKey];
      }

      values.push(value);
      filterStr += `${field} ${operator} $${values.length}`;
    }
  });

  return { filterStr, values };
};

const MAP_OPERATORS = {
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  ne: "<>",
  like: "LIKE",
  ilike: "ILIKE",
  // isNull: "IS NULL",
  // isNotNull: "IS NOT NULL",
};

export const keyConvertWrapper =
  (callback) =>
  async (...args) => {
    args = args.map((arg) => convertToSnakeShallow(arg));
    const result = await callback(...args);
    return convertToCamelShallow(result);
  };

export const FILTER_OPS = Object.keys(MAP_OPERATORS).reduce((acc, k) => ({ ...acc, [k]: k }), {});
