import express from "express"
import cors from "cors"

import visitorRoutes from "./routes/visitorRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import chatRoutes from './routes/chatRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import helmet from "helmet"
import { apiLimiter } from "./config/rateLimiter.js"
import path from 'path'
import { fileURLToPath } from 'url'; // 1. Import the URL helper

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cors())
app.use(helmet(
    {
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
        frameguard: false
    }
))

app.use('/api/', apiLimiter)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.send("AI CHATBOT SERVER IS RUNNING")
})

app.use('/api/widget', visitorRoutes)
app.use('/api/widget', messageRoutes)
app.use('/api/conversation', chatRoutes)
app.use('/api/conversation', adminRoutes)

export default app