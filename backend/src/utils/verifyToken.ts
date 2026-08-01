import jwt from "jsonwebtoken";
import ApiError from "./ApiError";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export default verifyToken;