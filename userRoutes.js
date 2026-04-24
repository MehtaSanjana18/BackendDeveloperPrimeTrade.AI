import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate, authorize("admin"));
router.get("/", getAllUsers);

export default router;
