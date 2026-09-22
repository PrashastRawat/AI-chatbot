import Visitor from "../model/Visitor.js"
import Conversation from "../model/Conversation.js"


export const newVisitor  = async (req,res)=>{
    const {name, profession, goal} = req.body
    try {
        if(!name|| !profession|| !goal){
            return res.status(400).json({error: 'fill the info'});
        }
        const visitor = await Visitor.create({name:name,profession: profession,goal: goal})
        const conversation = await Conversation.create({visitorId: visitor._id})

        console.log('New Visitor onboard: ', {name, profession, goal})
        res.status(201).json({
            message: "New conversation",
            visitorId: visitor._id,
            conversationId: conversation._id
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Server error'})
    }
}

