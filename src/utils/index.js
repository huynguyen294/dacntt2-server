import mapKeys from "lodash/mapKeys.js";
import snakeCase from "lodash/snakeCase.js";
import camelCase from "lodash/camelCase.js";

export const displayDate = (value) => (value ? format(new Date(value), "dd-MM-yyyy") : "");

export const convertToSnakeShallow = (value) => {
  if (!value) return null;
  if (typeof value !== "object") return snakeCase(value);
  if (Array.isArray(value)) return value.map((v) => convertToSnakeShallow(v));
  return mapKeys(value, (_, key) => snakeCase(key));
};

export const convertToCamelShallow = (value) => {
  if (!value) return null;
  if (typeof value !== "object") return camelCase(value);
  if (Array.isArray(value)) return value.map((v) => convertToCamelShallow(v));
  return mapKeys(value, (_, key) => camelCase(key));
};

export const transformQueryToFilterObject = (query, searchFields = ["name"]) => {
  const { searchQuery, filter } = query;

  const filterObj = {};
  if (searchQuery) {
    filterObj.search = searchFields.map((f) => ({ [snakeCase(f)]: `%${searchQuery}%` }));
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
const defaultTransformFieldsOptions = { basicFields: ["id", "name"], defaultObject: {} };
export const transformFields = (queryField = "", options = defaultTransformFieldsOptions) => {
  const {
    basicFields = defaultTransformFieldsOptions.basicFields,
    defaultObject = defaultTransformFieldsOptions.defaultObject,
  } = options;

  if (queryField) {
    const splitted = queryField.split(",");
    if (splitted.length > 1) return convertToSnakeShallow(splitted);
  }

  switch (queryField) {
    case ":basic":
      return convertToSnakeShallow(basicFields);
    case ":full":
    default:
      return Object.keys(defaultObject);
  }
};

export const arrayToObject = (arr = [], property = "id") => {
  return arr.reduce((acc, curr) => ({ ...acc, [curr[property]]: curr }), {});
};
