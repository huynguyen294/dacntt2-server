import mapKeys from "lodash/mapKeys.js";
import snakeCase from "lodash/snakeCase.js";
import camelCase from "lodash/camelCase.js";

function convertToSnakeShallow(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value.map((v) => convertToSnakeShallow(v));
  return mapKeys(value, (_, key) => snakeCase(key));
}

function convertToCamel2Levels(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;

  // Cấp 1
  const level1 = mapKeys(obj, (_, key) => camelCase(key));

  for (const key in level1) {
    const val = level1[key];

    if (Array.isArray(val)) {
      // Nếu là mảng các object → convert từng object trong mảng
      level1[key] = val.map((item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          return mapKeys(item, (_, k) => camelCase(k));
        }
        return item;
      });
    } else if (val && typeof val === "object") {
      // Nếu là object lồng → convert key ở cấp 2
      level1[key] = mapKeys(val, (_, k) => camelCase(k));
    }

    // Nếu là kiểu dữ liệu khác (string, number...) → giữ nguyên
  }

  return level1;
}

const caseConverter = (req, res, next) => {
  // Convert req.body và req.query từ camel → snake
  if (req.body && typeof req.body === "object") {
    req.body = convertToSnakeShallow(req.body);
  }

  // Ghi đè res.json để convert ngược lại từ snake → camel
  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === "object") {
      data = convertToCamel2Levels(data);
    }
    return originalJson.call(this, data);
  };

  next();
};

export default caseConverter;
