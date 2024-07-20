import {connectToDB} from '../../../../mongodb/index'
import User from '../../../../models/User'
import Chat from '../../../../models/Chat'
import Message from '../../../../models/Message'
export const GET = async(req,{params})=>{
    try{
        await connectToDB();

        const {chatId} = params;

        const chat = await Chat.findById(chatId).populate({
            path : 'members',
            model : User,
        }).populate({
            path:'messages',
            model:Message,
            populate:{
                path:"sender seenBy",
                model:User
            }
        })
        .exec()

        return new Response(JSON.stringify(chat),{status:200})
    }catch(error){
        console.log(error)
        return new Response("Failed to get chat details",{status:500})
    }
}

export const POST = async (req, { params }) => {
    try {
      await connectToDB();
  
      const { chatId } = params;
  
      const body = await req.json();
  
      const { currentUserId } = body;
  
      await Message.updateMany(
        { chat: chatId },
        { $addToSet: { seenBy: currentUserId } },
        { new: true }
      )
        .populate({
          path: "sender seenBy",
          model: User,
        })
        .exec();
  
      return new Response("Seen all messages by current user", { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Failed to update seen messages", { status: 500 });
    }
  };