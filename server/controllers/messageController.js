import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js"


export const lastMessage = async (req,res)=>{
    const {visitorId} = req.params;
    try {
        if(!visitorId){
            return res.status(400).json({error: 'Visitor ID is required'})
        }
        const conversation = await Conversation.findOne({ visitorId}).populate("visitorId");
        if(!conversation){
            return res.status(404).json({error: 'Converstion not found for this visitor'})
        }

        const messages = await Message.find({ conversationId: conversation._id}).sort({createdAt:1})

        return res.status(200).json({
            visitorName: conversation.visitorId.name,
            conversationId: conversation._id,
            messages: messages.map(msg=>({
                sender: msg.senderId,
                text: msg.text,
                createdAt: msg.createdAt
            }))
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Server error'})
    }
}