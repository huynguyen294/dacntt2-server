import pgDB from "../configs/db.js";

export const generateCommonServices = (tableName) => {
  // check allowed tables

  // generatePager
  const generatePager = async (filter = {}, pager) => {
    if (!pager) return [null, ""];
    const { page, pageSize } = pager;

    const query = `SELECT COUNT(*) FROM ${tableName}`;
    const { filterStr, values } = generateFilterString(filter);
    const finalQuery = query + filterStr;

    console.log("count page:", finalQuery);
    const result = await pgDB.query(finalQuery, values);
    const total = Number(result.rows[0].count);
    const pageCount = Math.ceil(total / pageSize);
    const pagerGenerated = { total, pageCount, page, pageSize };
    const pagerStr = ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    return [pagerGenerated, pagerStr];
  };

  // generate order
  const generateOrderStr = ({ order, orderBy }) => ` ORDER BY ${orderBy} ${order} `;

  return {
    create: async (data) => {
      const fields = Object.keys(data);
      const fieldsStr = fields.join(", ");
      const valuesStr = fields.map((f, index) => "$" + (index + 1));

      const query = `INSERT INTO ${tableName} (${fieldsStr}) VALUES (${valuesStr}) RETURNING *`;
      const values = fields.map((f) => data[f]);
      console.log("create:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    },

    updateById: async (id, newData) => {
      const fields = Object.keys(newData);

      const valuesStr = fields.map((f, index) => `${f} = $${index + 1}`).join(", ");
      const values = fields.map((f) => newData[f]);
      values.push(id);

      const query = `UPDATE ${tableName} SET ${valuesStr} WHERE id = $${values.length} RETURNING *`;
      console.log("updateById:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    },

    delete: async (id) => {
      const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
      const values = [id];
      console.log("delete:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    },

    find: async (filter = {}, pager, order) => {
      const [pagerGenerated, pagerStr] = await generatePager(filter, pager);
      const orderStr = generateOrderStr(order);

      const query = `SELECT * FROM ${tableName}`;
      const { filterStr, values } = generateFilterString(filter, pager);
      const finalQuery = query + filterStr + orderStr + pagerStr;

      if (pagerStr) {
        values.push(pager.pageSize);
        const offset = (pager.page - 1) * pager.pageSize;
        values.push(offset);
      }

      console.log("find:", finalQuery, values);
      const result = await pgDB.query(finalQuery, values);
      return { rows: result.rows, pager: pagerGenerated };
    },

    findOne: async (filter = {}) => {
      const query = `SELECT * FROM ${tableName}`;
      const { filterStr, values } = generateFilterString(filter);
      const finalQuery = query + filterStr + " LIMIT 1";

      console.log("findOne:", finalQuery);
      const result = await pgDB.query(finalQuery, values);
      return result.rows[0] ?? null;
    },

    findById: async (id) => {
      const query = `SELECT * FROM ${tableName} WHERE id = $1`;
      const values = [id];
      console.log("findById:", query);

      const result = await pgDB.query(query, values);
      return result.rows[0] ?? null;
    },
  };
};

const generateFilterString = (filter) => {
  const values = [];
  let filterStr = "";

  if (Object.values(filter).filter(Boolean).length === 0) return { filterStr, values };

  filterStr = " WHERE ";
  Object.keys(filter).forEach((field, i) => {
    let value = filter[field];
    let operator = "=";

    // Handle array condition
    if (Array.isArray(value)) {
      const orConditions = value
        .map((val, idx) => {
          values.push(val);
          return `${field} = $${idx + 1}`;
        })
        .join(" OR ");
      filterStr += `(${orConditions})`;
    } else {
      // If value is an object, extract the operator
      if (typeof value === "object" && value !== null) {
        const [opKey] = Object.keys(value);
        operator = MAP_OPERATORS[opKey] || "=";
        value = value[opKey];
      }

      // Add AND if not the first condition
      if (i > 0) filterStr += " AND ";

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

export const FILTER_OPS = Object.keys(MAP_OPERATORS).reduce((acc, k) => ({ ...acc, [k]: k }), {});
