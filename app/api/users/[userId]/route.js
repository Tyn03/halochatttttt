import Chat from '../../../../models/Chat'
import {connectToDB} from '../../../../mongodb/index'
import User from '../../../../models/User'
import Message from '../../../../models/Message'
export const GET = async(req,{params})=>{
    try{
        await connectToDB();

        const {userId} = params;
        const allChat = await Chat.find({members:userId})
        .sort({lastMessageAt: -1})
        .populate({
            path:"members",
            model:User,
        }).populate({
            path: "messages",
            model: Message,
            populate: {
              path: "sender seenBy",
              model: User,
            },
          })
        .exec();

        return new Response(JSON.stringify(allChat),{status:200});
    }catch(error){
        console.log(error)
        return new Response("Failed to get all chats of current user",{status:500})
    }
}