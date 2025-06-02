import { auth } from "../middlewares/index.js";

const defaultController = { get: () => {}, create: () => {}, getById: () => {}, update: () => {}, delete: () => {} };
const defaultOptions = {
  middlewares: { get: [auth], create: [auth], getById: [auth], update: [auth], delete: [auth] },
};

export const generateCRUDRoutes = (router, controller = defaultController, options = defaultOptions) => {
  const { middlewares = defaultOptions.middlewares } = options;
  const {
    get: getMiddlewares = defaultOptions.middlewares.get,
    create: createMiddlewares = defaultOptions.middlewares.create,
    getById: getByIdMiddlewares = defaultOptions.middlewares.getById,
    update: updateMiddlewares = defaultOptions.middlewares.update,
    delete: deleteMiddlewares = defaultOptions.middlewares.delete,
  } = middlewares;

  router.get("/", ...getMiddlewares, controller.get);
  router.post("/", ...createMiddlewares, controller.create);
  router.get("/:id", ...getByIdMiddlewares, controller.getById);
  router.patch("/:id", ...updateMiddlewares, controller.update);
  // update many without id
  router.patch("/", ...updateMiddlewares, controller.update);
  router.delete("/:id", ...deleteMiddlewares, controller.delete);
  router.delete("/", ...deleteMiddlewares, controller.delete);
};
