import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const authenticate = expressAsyncHandler(async (req, res, next) => {
  const token = req?.cookies?.token || req.headers?.authorization?.split(" ")[1];
  if (!token) {
    throw new ErrorHandler(401, "Please login to access this resource");
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    throw new ErrorHandler(401, "Invalid or expired token. Please login again");
  }
  const user = await userModel.findById(decodedToken._id).select("-password");
  if (!user) {
    throw new ErrorHandler(401, "Please login to access this resource");
  }
  req.user = user;
  next();
});

export default authenticate;
