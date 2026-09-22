import dotenv from "dotenv"
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cors from 'cors'
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import Groq from "groq-sdk"
import path from "path"
import connectDb from "./config/db.js"
import app from "./app.js"
// import config from "./config.js"


const PORT = process.env.PORT || 5000

connectDb()

const gropapikey = process.env.GROQ_API
if(!gropapikey){
    console.log(`No ai API key`)
    process.exit(1)
}


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})