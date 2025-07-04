import express from "express"
import { checkUniqueName, login, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-profile", protectedRoute, updateProfile);
router.get("/check-unique-username", checkUniqueName)

export default router;