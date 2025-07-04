import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { acceptFriendRequest, getFriendRequest, rejectFriendRequest, sendFriendRequest } from "../controllers/request.controller.js";
const router = express.Router()

router.post("/send-friend-request", protectedRoute, sendFriendRequest)
router.get("/get-freiend-request", protectedRoute, getFriendRequest)
router.post("/accept-friend-request", protectedRoute, acceptFriendRequest)
router.post("/reject-friend-request", protectedRoute, rejectFriendRequest)
export default router;