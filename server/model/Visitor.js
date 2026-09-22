import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    profession:{
        type: String,
        required: true,
        trim: true
    },
    goal:{
        type: String,
        required: true,
        trim: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Visitor = mongoose.model('Visitor', VisitorSchema)

export default Visitor