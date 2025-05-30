import pgDB from "../configs/db.js";
import camelCase from "lodash/camelCase.js";
import { ORDER } from "../constants/index.js";
import { convertToCamelShallow, convertToSnakeShallow } from "../utils/index.js";

export const generateCommonServices = (tableName) => {
  return {
    // use for create many and update many when the payload { [tableName]: Object[] }
    // so camelCase this
    tableName: camelCase(tableName),

    create: keyConvertWrapper(async (data) => {
      const fields = Object.keys(data);
      const fieldsStr = fields.join(", ");
      const valuesStr = fields.map((f, index) => "$" + (index + 1));

      const query = `INSERT INTO ${tableName} (${fieldsStr}) VALUES (${valuesStr}) RETURNING *`;
      const values = fields.map((f) => data[f] || null);
      console.log("create:", query, values);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    }),

    createMany: keyConvertWrapper(async (list = [], excepts = []) => {
      const values = [];
      const fields = list.reduce((acc, data) => {
        Object.keys(data).forEach((field) => !acc.includes(field) && acc.push(field));
        return acc;
      }, []);

      const exceptsStr = excepts.length > 0 ? `ON CONFLICT (${excepts.join(",")}) DO NOTHING` : "";

      const valuesStr = list
        .map((data) => {
          const valuesStr = fields
            .map((f) => {
              values.push(data[f] || null);
              return "$" + values.length;
            })
            .join(", ");
          return `(${valuesStr})`;
        })
        .join(", ");

      const fieldsStr = fields.join(", ");
      const query = `INSERT INTO ${tableName} (${fieldsStr}) VALUES ${valuesStr} ${exceptsStr} RETURNING *`;

      console.log("createMany:", query, values);
      const result = await pgDB.query(query, values);
      return result.rows;
    }),

    updateById: keyConvertWrapper(async (id, newData) => {
      const fields = Object.keys(newData);

      const valuesStr = fields.map((f, index) => `${f} = $${index + 1}`).join(", ");
      const values = fields.map((f) => newData[f] || null);
      values.push(id);

      const query = `UPDATE ${tableName} SET ${valuesStr} WHERE id = $${values.length} RETURNING *`;
      console.log("updateById:", query, values);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    }),

    updateMany: keyConvertWrapper(async (list = []) => {
      try {
        await pgDB.query("BEGIN");
        const values = list.map((u) => u.id);
        const fields = list.reduce((acc, data) => {
          Object.keys(data).forEach((field) => field !== "id" && !acc.includes(field) && acc.push(field));
          return acc;
        }, []);

        let query = `UPDATE ${tableName} SET \n`;
        const listCase = fields.map((field) => {
          let caseStr = "";
          list.forEach((item, index) => {
            values.push(item[field] || null);
            caseStr += `WHEN id = $${index + 1} THEN $${values.length} \n`;
          });
          return `${field} = CASE \n${caseStr} END`;
        });
        query += listCase.join(",\n") + "\n";

        console.log("updateMany:", query, values);
        const result = await pgDB.query(query, values);
        await pgDB.query("COMMIT");

        return result.rows;
      } catch (error) {
        await pgDB.query("ROLLBACK");
        throw error;
      }
    }),

    delete: keyConvertWrapper(async (id) => {
      const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
      const values = [id];
      console.log("delete:", query, values);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    }),

    deleteMany: keyConvertWrapper(async (listId = []) => {
      const query = `DELETE FROM ${tableName} WHERE id = ANY($1) RETURNING *`;
      const values = [listId];
      console.log("delete:", query, values);

      const result = await pgDB.query(query, values);
      return result.rows[0];
    }),

    find: keyConvertWrapper(async (filter = {}, pager, order, fields) => {
      const [pagerGenerated, pagerStr] = await generatePager(tableName, filter, pager);
      const orderStr = generateOrderStr(order);
      const fieldsStr = generateFieldsStr(fields);

      const query = `SELECT ${fieldsStr} FROM ${tableName}`;
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

    findOne: keyConvertWrapper(async (filter = {}, fields) => {
      const fieldsStr = generateFieldsStr(fields);
      const query = `SELECT ${fieldsStr} FROM ${tableName}`;
      const { filterStr, values } = generateFilterString(filter);
      const finalQuery = query + filterStr + " LIMIT 1";

      console.log("findOne:", finalQuery, values);
      const result = await pgDB.query(finalQuery, values);
      return result.rows[0] ?? null;
    }),

    findManyById: keyConvertWrapper(async (listId, idField = "id", fields) => {
      const fieldsStr = generateFieldsStr(fields);
      const query = `SELECT ${fieldsStr} FROM ${tableName} WHERE ${idField} = ANY($1)`;
      const values = [listId];

      console.log("findOne:", query, values);
      const result = await pgDB.query(query, values);
      return result.rows;
    }),

    exists: keyConvertWrapper(async (filter = {}) => {
      const query = `SELECT 1 FROM ${tableName}`;
      const { filterStr, values } = generateFilterString(filter);
      let finalQuery = query + filterStr;

      finalQuery = `SELECT 1 WHERE EXISTS (${finalQuery})`;
      console.log("findOne:", finalQuery, values);
      const result = await pgDB.query(finalQuery, values);
      return Boolean(result.rows[0]);
    }),

    findById: keyConvertWrapper(async (id, fields = []) => {
      const fieldsStr = generateFieldsStr(fields);
      const query = `SELECT ${fieldsStr} FROM ${tableName} WHERE id = $1`;
      const values = [id];
      console.log("findById:", query, values);

      const result = await pgDB.query(query, values);
      return result.rows[0] ?? null;
    }),

    countBy: keyConvertWrapper(async (countBy, filter = {}) => {
      const { filterStr, values } = generateFilterString(filter);
      const query = `SELECT ${countBy}, COUNT(*) AS total FROM ${tableName} ${filterStr} GROUP BY ${countBy}`;

      console.log("countBy:", query, values);
      const result = await pgDB.query(query, values);
      return result.rows;
    }),
  };
};

export const generateFieldsStr = (fields, shortName) => {
  if (!fields?.length) return shortName ? `${shortName}.*` : "*";
  if (!shortName) return fields.join(", ");
  return fields.map((f) => shortName + "." + f).join(", ");
};

export const generateOrderStr = (orderObj, shortName) => {
  if (!orderObj) return "";
  if (shortName) orderObj.order_by = shortName + "." + orderObj.order_by;
  const { order, order_by } = orderObj;
  const nullStr = (order || ORDER.order).toLowerCase() === "desc" ? "NULLS LAST" : "NULLS FIRST";

  return ` ORDER BY ${order_by} ${order} ${nullStr}`;
};

export const generatePager = async (tableName, filter = {}, pager, valueSize) => {
  if (!pager) return [null, ""];
  const { page, page_size } = pager;

  const query = `SELECT COUNT(*) FROM ${tableName}`;
  const { filterStr, values } = generateFilterString(filter);
  const finalQuery = query + filterStr;

  console.log("generatePager", finalQuery);
  const result = await pgDB.query(finalQuery, values);
  const total = Number(result.rows[0].count);
  const page_count = Math.ceil(total / page_size) || 1;
  const pagerGenerated = { total, page_count, page, page_size };

  const pagerStr = ` LIMIT $${(valueSize || values.length) + 1} OFFSET $${(valueSize || values.length) + 2}`;

  return [pagerGenerated, pagerStr];
};

export const generateSearchString = (values, filterStr, searchValue) => {
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

export const generateFilterString = (filter) => {
  const values = [];
  let filterStr = "";

  if (Object.values(filter).filter(Boolean).length === 0) return { filterStr, values };

  filterStr = " WHERE ";

  const generateCondition = (field, value, operator = "=") => {
    if (typeof value === "object" && value !== null) {
      const [opKey] = Object.keys(value);
      operator = MAP_OPERATORS[opKey];
      value = value[opKey];
    }

    if (value === true) return `${field} ${operator}`;

    values.push(value);
    if (operator === "ANY") return `${field} = ${operator}($${values.length})`;
    return `${field} ${operator} $${values.length}`;
  };

  Object.keys(filter).forEach((field) => {
    let value = filter[field];

    // handle search
    if (field === "search" || field.includes(".search")) {
      // Add AND if not the first condition
      // Add AND if not the first condition
      if (values.length > 0) currentFilterStr += " AND ";
      filterStr += generateSearchString(values, "", value);
    }
    // Handle array condition
    else if (Array.isArray(value)) {
      // Add AND if not the first condition
      if (values.length > 0) filterStr += " AND ";

      const orConditions = value.map((val) => generateCondition(field, val)).join(" OR ");
      filterStr += `(${orConditions})`;
    }
    // Handle operator
    else {
      // Add AND if not the first condition
      if (values.length > 0) filterStr += " AND ";
      filterStr += generateCondition(field, value);
    }
  });

  return { filterStr, values };
};

const MAP_OPERATORS = {
  eq: "=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  ne: "<>",
  like: "LIKE",
  ilike: "ILIKE",
  any: "ANY",
  in: "ANY",
  isNull: "IS NULL",
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

export const filterPropertyByDefaultObject = (targetObject = {}, defaultObject = {}, extProps = []) =>
  Object.keys(targetObject).reduce((acc, field) => {
    if (extProps.includes(field) || defaultObject.hasOwnProperty(field)) acc[field] = targetObject[field];
    return acc;
  }, {});

export const mergeFilterByShortName = (filters = {}) =>
  Object.keys(filters).reduce((acc, shortName) => {
    const object = filters[shortName];
    Object.keys(object).forEach((property) => {
      const pre = `${shortName}.`;
      if (property.includes(pre)) {
        acc[property] = object[property];
      } else {
        acc[[pre + property]] = object[property];
      }
    });
    return acc;
  }, {});
