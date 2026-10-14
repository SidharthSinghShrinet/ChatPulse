import Router from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
const router = Router();

//& @desc    Send a message
//& @route   POST /api/v1/messages/send/:id
//& @access  Private
//& id -> Receiver Id
router.post("/send/:id", authenticate, sendMessage);

//& @desc    Getting messages between two users
//& @route   GET /api/v1/messages/:id
//& @access  Private
//& id -> Receiver Id
router.get("/:id", authenticate, getMessage);

export default router;