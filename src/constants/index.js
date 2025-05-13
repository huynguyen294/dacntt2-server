export const PAGER = { total: 0, pageCount: 1, page: 1, pageSize: 50 };
export const ORDER = { order: "DESC", orderBy: "created_at" };
export const EMPLOYEE_ROLES = ["consultant", "finance-officer"];

const ROLES = ["admin", "create", "read", "read_own", "update", "update_own", "delete", "delete_own"];

const PERMISSION_BY_ROLES = {
  admin: ["user:admin"],
  student: [
    "user:read_own",
    "user:update_own",
    "course:read",
    "class:read_own",
    "exam:read_own",
    "shift:read_own",
    "certificate:read_own",
    "enrollment:read_own",
  ],
  teacher: ["user:read_own", "user:update_own"],
  consultant: ["user:read_own", "user:update_own"],
  "finance-officer": ["user:read_own", "user:update_own"],
};

export const checkRoles = (userRole, role) => PERMISSION_BY_ROLES[userRole].includes(role);
