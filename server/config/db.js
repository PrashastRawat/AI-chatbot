import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo db is connected to ${conn.connection.host}`)
    } catch (error) {
        console.log(`Database error${error.message}`)
        process.exit(1);
    }
}

export default connectDb