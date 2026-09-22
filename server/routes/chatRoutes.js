import express, { Router } from "express"
import { newChat } from "../controllers/chatController.js"


const router = Router()

router.post("/history/chathistory", newChat)

export default router