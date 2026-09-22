import express from "express"
import { getAnalytics, getConversations, getConversationsById } from "../controllers/adminController.js"


const router = express.Router()

router.get("/history/getAnalytic", getAnalytics)
router.get("/history/getConversations", getConversations)
router.get("/history/getConversationsById/:conversationId", getConversationsById)

export default router
