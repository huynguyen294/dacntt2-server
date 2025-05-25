import { auth, roles } from "../middlewares/index.js";
import { classModel, courseModel, studentConsultationModel, userModel } from "../models/index.js";
import { arrayToObject, transformQueryToFilterObject } from "../utils/index.js";
import { sendMail } from "./utils.js";
import bcrypt from "bcryptjs";

// [GET] /student-consultation?refs=true
const getStudentWithRefs = async (req, res, next) => {
  try {
    const { refs } = req.query;
    if (refs !== "true") return next();

    const { refFields = ":basic" } = req.query;
    const filterObj = transformQueryToFilterObject(req.query, ["name", "email", "phone_number"]);
    const [rows, pager] = await studentConsultationModel.find(filterObj, req.pager, req.order);

    const refData = {};
    const [userIds, classIds, courseIds] = rows.reduce(
      (acc, row) => {
        if (row.consultantId) acc[0].push(row.consultantId);
        if (row.createdBy) acc[0].push(row.createdBy);
        if (row.expectedClassId) acc[1].push(row.expectedClassId);
        if (row.expectedCourseId) acc[2].push(row.expectedCourseId);
        return acc;
      },
      [[], [], []]
    );

    const { status, consultantId, ...countFilter } = filterObj;
    if (consultantId && status !== "Chờ tư vấn") countFilter.consultantId = consultantId;

    const [[users], [classes], [courses], counted] = await Promise.all([
      userModel.find({ id: { in: userIds } }, req.pager, null, userModel.getFields(refFields)),
      classModel.find({ id: { in: classIds } }, req.pager, null, classModel.getFields(refFields)),
      courseModel.find({ id: { in: courseIds } }, req.pager, null, courseModel.getFields(refFields)),
      studentConsultationModel.countBy("status", countFilter),
    ]);

    const statusCount = counted.reduce((acc, curr) => ({ ...acc, [curr.status]: Number(curr.total) }), {});
    refData.users = arrayToObject(users, "id");
    refData.classes = arrayToObject(classes, "id");
    refData.courses = arrayToObject(courses, "id");

    res.status(200).json({ rows, pager, refs: refData, statusCount });
  } catch (error) {
    next(error);
  }
};

// [POST] /student-consultation
// !studentId
const createAccount = async (req, res, next) => {
  try {
    const { studentId, status } = req.body;
    if (studentId || status !== "Đã đồng ý") return next();

    const { email, name, gender, dateOfBirth, phoneNumber, address, password } = req.body;
    const userData = { email, name, gender, dateOfBirth, phoneNumber, address, password, role: "student" };
    const oldUser = await userModel.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "Email này đã đăng ký." });

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    userData.password = hashedPassword;
    userData.created_by = req.userId;
    const created = await userModel.create(userData);
    req.body.studentId = created.id;
    delete req.body.password;

    next();

    await sendMail({
      subject: "Cấp tài khoản thành công",
      email,
      html: `<div>
      <p>Bạn đã được cấp tài khoản tại trung tâm với thông tin đăng nhập:</p>
      <div style="border-radius: 8px; padding: 8px; background-color: #efefef;">
      <p style="margin: 2px"><strong>Tên đăng nhập</strong>: ${email}</p>
      <p style="margin: 2px"><strong>Mật khẩu</strong>: ${password}</p>
      </div>
      <p><strong>Lưu ý</strong>: Đây là mật khẩu mặc định, bạn có thể thay đổi ở phần 'Hồ sơ cá nhân' để bảo mật tài khoản.</p>
      </div>`,
    });
  } catch (error) {
    next(error);
  }
};

export const studentConsultationMiddlewares = {
  get: [auth, roles(["admin", "consultant", "finance-officer"]), getStudentWithRefs],
  create: [auth, roles(["admin", "consultant", "finance-officer"]), createAccount],
  update: [auth, roles(["admin", "consultant", "finance-officer"]), createAccount],
  delete: [auth, roles(["admin", "consultant", "finance-officer"])],
  getById: [auth, roles(["admin", "consultant", "finance-officer"])],
};
