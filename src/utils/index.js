import mapKeys from "lodash/mapKeys.js";
import snakeCase from "lodash/snakeCase.js";
import camelCase from "lodash/camelCase.js";

export const convertToSnakeShallow = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value.map((v) => convertToSnakeShallow(v));
  return mapKeys(value, (_, key) => snakeCase(key));
};

export const convertToCamelShallow = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value.map((v) => convertToCamelShallow(v));
  return mapKeys(value, (_, key) => camelCase(key));
};
