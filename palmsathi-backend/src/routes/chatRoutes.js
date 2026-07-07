import { Router } from "express";
import { chat } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, chat);

export default router;