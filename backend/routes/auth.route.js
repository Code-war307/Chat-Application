import express from "express"
import { checkUniqueName, login, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-profile", protectedRoute, upload.single("profilePic"), updateProfile);
router.get("/check-unique-username", checkUniqueName)

export default router;