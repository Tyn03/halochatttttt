import User from '../../../models/User'
import {connectToDB} from '../../../mongodb/index'
export const GET = async(req,res)=>{
    try{
        await connectToDB();

        const allUser = await User.find();

        return new Response(JSON.stringify(allUser),{status:200})
    }catch(error){
        return new Response("Failed to get all users",{status:500})
    }
}