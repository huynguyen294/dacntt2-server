const errorHandler = (err, req, res, next) => {
  if (err) {
    console.log(err.stack);
    res.status(500).json({
      message: `Lỗi hệ thống: ${err.message}`,
    });
  }
};

export default errorHandler;
