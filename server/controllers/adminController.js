import mongoose from "mongoose";
import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";
import Visitor from "../model/Visitor.js";

export const getAnalytics = async (req, res)=>{
    try{
        const totalVisitors = await Visitor.countDocuments();
        const totalConversations = await Conversation.countDocuments()
        const totalMessages = await Message.countDocuments()

        const proffesionsCount = await Visitor.aggregate([
            { $group: {_id: "$profession", count: {$sum:1}}},
            { $sort: {count: -1}}
        ])

        return res.status(200).json({
            totalVisitors,
            totalConversations,
            totalMessages,
            professions : proffesionsCount
        })
    }catch(error){
        console.log(error)
        res.status(500).json({error: "server error"})
    }
}

export const getConversations = async (req, res)=>{
    try {
        const conversations = (await Conversation.find().populate('visitorId')).toSorted({createdAt: -1}).limit(50);
        const response = [];
        return res.status(200).json({conversations})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Server error'})
    }
}

export const getConversationsById = async (req,res)=>{
    const {conversationId} = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(conversationId)){
            return res.status(400).json({error: 'invalid Conversation Id'})
        }
        const conversation = await Conversation.findById(conversationId).populate('visitorId');
        if(!conversation){
            return res.status(404).json({ error: 'Conversation not found'})
        }
        const messages = await Message.find({conversationId}).sort({ createdAt:1});
        return res.status(200).json({
            conversation:{
                id: conversation._id,
                visitor:{
                    name: conversation.visitorId.name,
                    profession: conversation.visitorId.profession,
                    goal: conversation.visitorId.goal
                },
                message: message.map(msg=>({
                    sender: msg.senderId,
                    text: msg.text,
                    createdAt: msg.createdAt
                }))
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Server error'})
    }
}