import zodToOpenapi, { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { userController } from "../controllers/index.js";
import { userSchema } from "../models/userModel.js";

const { OpenAPIRegistry, extendZodWithOpenApi } = zodToOpenapi;
extendZodWithOpenApi(z);

const openAPIRegistry = new OpenAPIRegistry();

console.log(userController.docs);
userController.docs.forEach((doc) => openAPIRegistry.registerPath(doc));

// openAPIRegistry.registerPath({
//   method: "get",
//   path: "/api-v1/users",
//   operationId: "getUsers",
//   summary: "Get all users",
//   tags: ["Users"],
//   parameters: [
//     { in: "query", name: "paging", example: true, allowEmptyValue: true },
//     { in: "query", name: "page", example: 1, allowEmptyValue: true },
//     { in: "query", name: "pageSize", example: 20, allowEmptyValue: true },
//     { in: "query", name: "order", example: "desc", allowEmptyValue: true },
//     { in: "query", name: "orderBy", example: "createdAt", allowEmptyValue: true },
//     { in: "query", name: "searchQuery", example: "searchString", allowEmptyValue: true },
//     { in: "query", name: "filter", example: "name:eq:alo", allowEmptyValue: true },
//   ],
//   responses: {
//     200: {
//       description: "User list",
//       content: { "application/json": { schema: userModel.schema.array } },
//     },
//   },
// });

// openAPIRegistry.registerPath({
//   method: "get",
//   path: "/api-v1/users?role=true",
//   operationId: "getUsersWithRole",
//   summary: "Get all users with role",
//   description: "Get by specific role. Each role will have another references data",
//   tags: ["Users"],
//   parameters: [
//     {
//       in: "query",
//       name: "role",
//       example: "_",
//       allowEmptyValue: true,
//       description: "Roles: _ | teacher | finance-officer | consultant | student",
//     },
//     { in: "query", name: "paging", example: true, allowEmptyValue: true },
//     { in: "query", name: "page", example: 1, allowEmptyValue: true },
//     { in: "query", name: "pageSize", example: 20, allowEmptyValue: true },
//     { in: "query", name: "order", example: "desc", allowEmptyValue: true },
//     { in: "query", name: "orderBy", example: "createdAt", allowEmptyValue: true },
//     { in: "query", name: "searchQuery", example: "searchString", allowEmptyValue: true },
//     { in: "query", name: "filter", example: "name:eq:alo", allowEmptyValue: true },
//   ],
//   responses: {
//     200: {
//       description: "User list",
//       content: { "application/json": { schema: userModel.schema.array } },
//     },
//   },
// });

// openAPIRegistry.registerPath({
//   method: "get",
//   path: "/api-v1/users/{id}",
//   operationId: "getUserById",
//   summary: "Get user by id",
//   tags: ["Users"],
//   parameters: [{ in: "path", name: "id", example: 1, required: true }],
//   responses: {
//     200: {
//       description: "User list",
//       content: { "application/json": { schema: userModel.schema.array } },
//     },
//   },
// });

openAPIRegistry.registerComponent("schemas", "User", userSchema);
openAPIRegistry.registerComponent("parameters", "paging", z.boolean());
openAPIRegistry.registerPath({
  method: "get",
  path: "/api-v1/users/{id}",
  operationId: "getUserById",
  summary: "Get user by id",
  tags: ["Users"],
  parameters: [{ $ref: "#/components/parameters/paging" }],
  responses: {
    200: {
      description: "User list",
    },
  },
});

const generator = new OpenApiGeneratorV3(openAPIRegistry.definitions);
const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Center management system open API",
    version: "1.0.0",
  },
});

console.log(openApiDocument);

export { openAPIRegistry };
export default openApiDocument;
