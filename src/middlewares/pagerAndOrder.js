import snakeCase from "lodash/snakeCase.js";
import { ORDER, PAGER } from "../constants/index.js";

const getPager = (query) => {
  const { paging, page, pageSize } = query;
  if (paging === "false") return null;
  // if query not have paging => default is true => use default
  return { page: Number(page) || PAGER.page, pageSize: Number(pageSize) || PAGER.pageSize };
};

const pagerAndOrder = (req, res, next) => {
  // pager handle
  req.pager = getPager(req.query);

  // order handle
  req.order = ORDER;

  const { order, orderBy } = req.query;
  if (order) req.order.order = order;
  if (orderBy) req.order.orderBy = snakeCase(orderBy);

  next();
};

export default pagerAndOrder;
