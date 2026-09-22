import express from "express"
import{ newVisitor } from "../controllers/visitorController.js"

const router = express.Router()

router.post("/onboard", newVisitor)

export default router
