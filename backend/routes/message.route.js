import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { multerErrorHandler } from "../errorHandler/multerErrorHandler.js";
const router = express.Router();

router.get("/users", protectedRoute, getUserForSidebar);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, upload.array("files", 10), multerErrorHandler, sendMessage)

export default router;