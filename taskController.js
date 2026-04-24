import mongoose from "mongoose";
import { Task } from "../models/Task.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user.id });
    return res.status(201).json({ message: "Task created", task });
  } catch (error) {
    return next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limitRaw = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const limit = Math.min(limitRaw, 50);
    const skip = (page - 1) * limit;

    const query = req.user.role === "admin" ? {} : { owner: req.user.id };
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(query)
    ]);

    return res.json({
      tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (req.user.role !== "admin" && task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json({ task });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (req.user.role !== "admin" && task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    Object.assign(task, req.body);
    await task.save();
    return res.json({ message: "Task updated", task });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (req.user.role !== "admin" && task.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await task.deleteOne();
    return res.json({ message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};
