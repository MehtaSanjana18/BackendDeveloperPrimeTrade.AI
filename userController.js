import { User } from "../models/User.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ users, total: users.length });
  } catch (error) {
    return next(error);
  }
};
