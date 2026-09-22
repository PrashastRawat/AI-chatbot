import express from "express"
import { getAnalytics, getConversations, getConversationsById } from "../controllers/adminController.js"
import { requireAdmin } from "../middlewares/adminMiddleware.js"


const router = express.Router()

router.get("/history/getAnalytic", requireAdmin, getAnalytics)
router.get("/history/getConversations", requireAdmin, getConversations)
router.get("/history/getConversationsById/:conversationId", requireAdmin, getConversationsById)

export default router
