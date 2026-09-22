import express from "express"
import { lastMessage } from "../controllers/messageController.js"


const router = express.Router()

router.post("/history/:visitorId", lastMessage)

export default router
