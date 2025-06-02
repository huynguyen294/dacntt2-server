const errorHandler = (err, req, res, next) => {
  if (err) {
    console.log(err.stack);
    res.status(500).json({
      message: err.message,
    });
  }
};

export default errorHandler;
