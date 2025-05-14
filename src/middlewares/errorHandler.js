const errorHandler = (err, req, res, next) => {
  console.log(res);
  if (err) {
    console.log(err.stack);
    res.status(500).json({
      message: "Hệ thống lỗi, vui lòng thử lại sau!",
      error: err.message,
    });
  }
};

export default errorHandler;
