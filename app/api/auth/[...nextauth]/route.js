import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {connectToDB} from "../../../../mongodb"
import User from "../../../../models/User"
import  {compare}  from "bcryptjs";
const handler = NextAuth({
    providers:[
       CredentialsProvider({
        name : "Credentials",
        async authorize(credentials,req){
            // credentials.email or credentials.password are the pawword and email we taper in the field
            if(!credentials.email || !credentials.password){
                throw new Error("Invalid email or password1");
            }

            await connectToDB();

            const user = await User.findOne({email : credentials.email});

            if(!user || !user.password){
                throw new Error("Invalid email or password2");
            }
            const isMatch = await compare(credentials.password,user.password);
            if (!isMatch) {
                throw new Error("Invalid password");
            }
            return user;
        }
       }) 
    ],
    secret: process.env.NEXTAUTH_SECRET,
    // use this callback to async render full the information of the user
    callbacks: {
      async session({ session }) {
        try {
          const mongodbUser = await User.findOne({ email: session.user.email });
          session.user.id = mongodbUser._id.toString();
          session.user = { ...session.user, ...mongodbUser._doc };
  
          return session;
        } catch (error) {
          console.error('Error during session callback:', error);
          return session; // Fallback to return session as is
        }
      },
    },
});


export { handler as GET, handler as POST };