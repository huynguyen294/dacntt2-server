import { classModel, employeeModel, userModel } from "../models/index.js";
import { transformQueryToFilterObject } from "../utils/index.js";
import { EMPLOYEE_ROLES, USER_SEARCH_FIELDS } from "../constants/index.js";
import { auth } from "../middlewares/index.js";
import { sendMail } from "./utils.js";
import bcrypt from "bcryptjs";
import groupBy from "lodash/groupBy.js";

const allowedUpdateUser = ["admin"];
const docs = [];

const signUpDoc = {
  method: "post",
  path: "/api-v1/users/sign-up",
  operationId: "signUp",
  tags: ["Users"],
  responses: {
    201: {
      description: "Register successfully!",
      content: { "application/json": { schema: { type: "json", example: `{ message: 'Đăng ký thành công!' }` } } },
    },
    400: { description: "Registered email!" },
    500: { description: "Something went wrong!" },
  },
};

docs.push(signUpDoc);
//[POST] /users/sign-up
const signUp = async (req, res, next) => {
  try {
    const { role, ...data } = req.body;
    const { email } = data;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;

    if (allowedUpdateUser.includes(req.userRole)) data.role = role;
    await userModel.create(data);
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    next(error);
  }
};

const createUserDoc = {
  method: "post",
  path: "/api-v1/users",
  operationId: "createUser",
  // summary: "",
  tags: ["Users"],
  responses: {
    201: { description: "Register successfully!" },
    400: { description: "Registered email!" },
    500: { description: "Something went wrong!" },
  },
};

docs.push(createUserDoc);
//[POST] /users
const createUser = async (req, res, next) => {
  const { sendmailNewAccount } = req.query;

  try {
    const { role, employmentType, certificates, major, startDate, salary, status, note, ...userData } = req.body;
    const employeeData = { employmentType, certificates, major, startDate, salary, status, note };

    const { email } = userData;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    userData.password = hashedPassword;
    userData.created_by = req.userId;

    // only allowedUpdateUser can assign role
    if (allowedUpdateUser.includes(req.userRole)) userData.role = role;
    const created = await userModel.create(userData);

    const refs = {};
    if (EMPLOYEE_ROLES.includes(role)) {
      employeeData.userId = created.id;
      const newEmployee = await employeeModel.create(employeeData);
      refs.userEmployees = { [created.id]: newEmployee };
    }

    if (sendmailNewAccount === "true") {
      await sendMail({
        email,
        subject: "Cấp tài khoản thành công",
        html: `<div>
      <p>Bạn đã được cấp tài khoản tại trung tâm với thông tin đăng nhập:</p>
      <div style="border-radius: 8px; padding: 8px; background-color: #efefef;">
      <p style="margin: 2px"><strong>Tên đăng nhập</strong>: ${email}</p>
      <p style="margin: 2px"><strong>Mật khẩu</strong>: ${password}</p>
      </div>
      <p><strong>Lưu ý</strong>: Đây là mật khẩu mặc định, bạn có thể thay đổi ở phần 'Hồ sơ cá nhân' để bảo mật tài khoản.</p>
      </div>`,
      });
    }

    res.status(201).json({ created, refs });
  } catch (error) {
    next(error);
  }
};

const updateUserDoc = {
  method: "patch",
  path: "/api-v1/users",
  operationId: "updateUser",
  // summary: "",
  tags: ["Users"],
  responses: {
    201: { description: "Update successfully!" },
    400: { description: "Wrong credential!" },
    500: { description: "Something went wrong!" },
  },
};

docs.push(updateUserDoc);
//[PATCH] /users/:id
const updateUser = async (req, res, next) => {
  const { resetPassword } = req.query;
  const { id } = req.params;
  try {
    if (!allowedUpdateUser.includes(req.userRole) && req.userId != id) {
      res.status(403).json({ message: "Quyền truy cập bị từ chối" });
      return;
    }

    // remove password, role, oid
    const {
      password,
      id: oid,
      employeeId,
      role,
      employmentType,
      certificates,
      major,
      startDate,
      salary,
      status,
      note,
      userId,
      oldPassword,
      ...userData
    } = req.body;
    const employeeData = { employmentType, certificates, major, startDate, salary, status, note };

    if (allowedUpdateUser.includes(req.userRole) && resetPassword !== "true") {
      userData.role = role;
      if (password) userData.password = await bcrypt.hash(password, 12);
    }

    if (resetPassword === "true") {
      const oldUser = await userModel.findById(id);
      if (oldUser.password) {
        const isPasswordCorrect = await bcrypt.compare(oldPassword, oldUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Mật khẩu không chính xác." });
      }

      userData.password = await bcrypt.hash(password, 12);
    }

    userData.last_updated_at = new Date();
    userData.last_updated_by = req.userId;
    const updated = await userModel.updateById(id, userData);

    const refs = {};
    if (EMPLOYEE_ROLES.includes(role)) {
      if (employeeId) {
        employeeData.userId = userId || id;
        const result = await employeeModel.updateById(employeeId, employeeData);
        refs.userEmployees = { [id]: result };
      } else {
        employeeData.userId = id;
        const result = await employeeModel.create(employeeData);
        refs.userEmployees = { [id]: result };
      }
    }

    res.status(201).json({ updated, refs });
  } catch (error) {
    next(error);
  }
};

//[GET] /users/check-email/:email
const checkUserByEMail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const exists = await userModel.exists({ email });
    res.status(201).json({ exists });
  } catch (error) {
    next(error);
  }
};

//[POST] /users/:id/compare-password
const comparePassword = async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const oldUser = await userModel.findById(id);
    if (oldUser.password) {
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
      if (!isPasswordCorrect) return res.status(400).json({ message: "Mật khẩu không chính xác." });
    }

    return res.status(200).json({ message: "Mật khẩu chính xác." });
  } catch (error) {
    next(error);
  }
};

//[GET] /users/forgot-password/:email
const forgotPassword = async (req, res, next) => {};

//[GET] /users/verify-reset-password-code/:email/:code
const verifyResetPasswordCode = async (req, res, next) => {};

//[PATCH] /users/reset-password/:email
const resetPassword = async (req, res, next) => {};

// [GET] /users?role=true
const getUsersWithRole = async (req, res, next) => {
  const { role, refFields = ":basic" } = req.query;

  if (!role || role === "admin" || role === "_") return next();

  try {
    const filterObj = transformQueryToFilterObject(req.query, USER_SEARCH_FIELDS, userModel.tableName);

    filterObj.role = role;
    if (["consultant", "finance-officer"].includes(role)) {
      const [rows, pager] = await userModel.findEmployee(filterObj, req.pager, req.order);
      return res.status(200).json({ rows, pager });
    }

    const refs = {};
    if (role === "teacher") {
      const [rows, pager] = await userModel.findEmployee(filterObj, req.pager, req.order);
      const [teacherClasses] = await classModel.find(
        { teacherId: { in: rows.map((r) => r.id) } },
        null,
        null,
        classModel.getFields(refFields)
      );

      refs.userClasses = groupBy(teacherClasses, "teacherId");
      return res.status(200).json({ rows, pager, refs });
    }

    if (role === "student") {
      const [rows, pager] = await userModel.find(filterObj, req.pager, req.order, userModel.getFields(":full"));
      const studentClasses = await classModel.findUserClasses(
        rows.map((r) => r.id),
        null,
        null,
        classModel.getFields(refFields)
      );

      refs.userClasses = groupBy(studentClasses, "studentId");

      return res.status(200).json({ rows, pager, refs });
    }
  } catch (error) {
    next(error);
  }
};

// [GET] /users/:id?refs=true
const getUserByIdWithRefs = async (req, res, next) => {
  const { refs, refFields = ":full" } = req.query;
  if (refs !== "true") return next();

  const { id } = req.params;

  try {
    let user = await userModel.findById(id);
    const role = user.role;

    // get data
    const promises = [null, null, []];
    if (EMPLOYEE_ROLES.includes(role)) {
      promises[0] = employeeModel.findOne({ userId: id });
    }

    switch (role) {
      case "student":
        promises[1] = classModel.findUserClasses([id], null, req.oder, classModel.getFields(refFields));
        break;
      case "teacher":
        promises[2] = classModel.find({ teacherId: id }, null, null, classModel.getFields(refFields));
        break;
    }

    const [employee, studentClasses, [teacherClasses]] = await Promise.all(promises);

    // merge data
    const refs = {};
    if (EMPLOYEE_ROLES.includes(role)) {
      const { id: employeeId, userId, ...employeeData } = employee || {};
      user = { ...user, ...employeeData, employeeId };
    }

    switch (role) {
      case "student":
        refs.classes = studentClasses;
        break;
      case "teacher":
        refs.classes = teacherClasses;
        break;
    }

    res.status(200).json({ item: user, refs });
  } catch (error) {
    next(error);
  }
};

export const userMiddlewares = {
  get: [auth, getUsersWithRole],
  getById: [auth, getUserByIdWithRefs],
  create: [auth],
  update: [auth],
};

export default {
  signUp,
  checkUserByEMail,
  comparePassword,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
  update: updateUser,
  create: createUser,
  docs,
};
