import mapKeys from "lodash/mapKeys.js";
import snakeCase from "lodash/snakeCase.js";
import camelCase from "lodash/camelCase.js";

export const convertToSnakeShallow = (value) => {
  if (!value) return null;
  if (typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => convertToSnakeShallow(v));
  return mapKeys(value, (_, key) => snakeCase(key));
};

export const convertToCamelShallow = (value) => {
  if (!value) return null;
  if (typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => convertToCamelShallow(v));
  return mapKeys(value, (_, key) => camelCase(key));
};

export const transformQueryToFilterObject = (query, searchFields = ["name"]) => {
  const { searchQuery, filter } = query;

  const filterObj = {};
  if (searchQuery) {
    filterObj.search = searchFields.map((f) => ({ [f]: `%${searchQuery}%` }));
  }

  if (filter) {
    let listFilter = typeof filter === "string" ? [filter] : filter;
    listFilter.forEach((item) => {
      const [field, operator, value] = item.split(":");
      switch (operator) {
        case "in":
          filterObj[field] = value.split(",");
          break;
        default:
          filterObj[field] = { [operator]: value };
          break;
      }
    });
  }

  return filterObj;
};

export const arrayToObject = (arr = [], property = "id") => {
  return arr.reduce((acc, curr) => ({ ...acc, [curr[property]]: curr }), {});
};
