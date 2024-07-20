import {connectToDB} from "../../../mongodb/index"
import Message from "../../../models/Message"
import Chat from "../../../models/Chat"
import { pusherServer } from "../../../lib/pusher"
import User from "../../../models/User"
export const POST = async(req,res)=>{
    try{
        await connectToDB();

        const body = await req.json();
        const{chatId,currentUserId,text,photo} = body;
        const currentUser = await User.findById(currentUserId)
        const newMessage = await Message.create({
            chat:chatId,
            sender:currentUser,
            text,
            photo,
            seenBy:currentUserId
        });
        const updateChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push : {messages:newMessage._id},
                $set :{lastMessageAt : newMessage.createAt}
            },
            {new:true}
        ).populate({
            path:"messages",
            model:Message,
            populate:{path:"sender seenBy",model:"User"},
        }).populate({
            path:"members",
            model:"User",
        }) .exec();

        await pusherServer.trigger(chatId,"new-message",newMessage);
        const lastMessage = updateChat.messages[updateChat.messages.length - 1];
        updateChat.members.forEach(async (member) => {
            try {
                await pusherServer.trigger(member._id.toString(), "update-chat", {
                id: chatId,
                messages: [lastMessage]
                });
            } catch (err) {
                console.error(`Failed to trigger update-chat event`);
            }
        });
        return new Response(JSON.stringify(newMessage),{status:200})
    }catch(error){
        return new Response("Failed to create new message",{status:500})
    }
}

// Create message