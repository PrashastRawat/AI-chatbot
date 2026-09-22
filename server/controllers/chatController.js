import mongoose from "mongoose"
import Visitor from "../model/Visitor.js"
import Conversation from "../model/Conversation.js"
import Message from "../model/Message.js"
import Groq from "groq-sdk"
import config from "../config/config.js"

const groq = process.env.GROQ_API
    ? new Groq({ apiKey: process.env.GROQ_API })
    : null

export const newChat = async (req,res) =>{
    const {visitorId, conversationId, message} = req.body
    try {
        if(!visitorId|| !conversationId|| !message){
            return res.status(400).json({error: 'Visitor ID, Conversation ID and message are required'})
        }

        if(!mongoose.Types.ObjectId.isValid(visitorId) || !mongoose.Types.ObjectId.isValid(conversationId)){
            return res.status(400).json({ error: 'Invalid Visitor ID or Conversation  ID'})
        }

        const visitor = await Visitor.findById(visitorId);
        if(!visitor){
            return res.status(404).json({error: 'Visitor not found'})
        }

        const conversation = await Conversation.findOne({ _id: conversationId, visitorId });
        if(!conversation){
            return res.status(404).json({error: 'Conversation not found for this visitor'})
        }

        const visitorMessage = new Message({
            conversationId,
            senderId: 'visitor',
            text: message
        })

        await visitorMessage.save()

        const pastMessages = await Message.find({ conversationId}).sort({createdAt:1}).limit(20)

        const formattedChatHistory = pastMessages.map(msg=>({
            role: msg.senderId === 'visitor'? 'user': 'assistant',
            content: msg.text
        }))

        const visitorContext = `Visitor Name: ${visitor.name}\nProfession: ${visitor.profession}\nGoal : ${visitor.goal}`
        const fullSystemInstruction = `${config.SYSTEM_PROMPT}\n\n${visitorContext}`

        const promptMessage =[
            { role: 'system', content: fullSystemInstruction},
            ...formattedChatHistory
        ]
        if(!groq){
            return res.status(503).json({error: 'AI service is not configured'})
        }

        const completion = await groq.chat.completions.create({
            model: config.GROQ_MODEL,
            messages: promptMessage,
            max_tokens: 500,
            temperature: 0.7
        })
        const aiReplyText = completion.choices[0]?.message?.content
        if(!aiReplyText){
            return res.status(502).json({error: 'AI service returned an empty response'})
        }

        const aiMessage = new Message({
            conversationId,
            senderId: 'ai',
            text: aiReplyText
        });
        await aiMessage.save();

        return res.status(200).json({reply: aiReplyText})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Server error'})
    }
}