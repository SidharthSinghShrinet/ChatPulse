const error = (err, req, res, next) => {
  //& -----Validation Error----------------------------------------------------------------------
  if (err.name === "ValidationError") {
    err.status = 400;
    err.message = Object.values(err.errors)
      .map((err) => err.message)
      .join(", ");
  }

  //& -----Duplicate Key Error----------------------------------------------------------------------
  if (err.code === 11000) {
    err.status = 409;
    let field = Object.entries(err.errorResponse.keyValue);
    err.message = `Provided ${field} is already in use`;
  }

  //& -----Cast Error----------------------------------------------------------------------
  if (err.name === "CastError") {
    ((err.message = "Invalid ID format, please check the ID you provided"),
      (err.statusCode = 400));
  }

  //& -----JWT Error----------------------------------------------------------------------
  if (err.name === "JsonWebTokenError") {
    ((err.message = "Invalid token, please login again!"),
      (err.statusCode = 401));
  }
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errObj: err,
  });
};

export default error;
