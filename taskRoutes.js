import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { taskSchema } from "../utils/schemas.js";

const router = Router();

router.use(authenticate);
router.get("/", getTasks);
router.post("/", validate(taskSchema), createTask);
router.get("/:id", getTaskById);
router.put("/:id", validate(taskSchema.partial()), updateTask);
router.delete("/:id", deleteTask);

export default router;
