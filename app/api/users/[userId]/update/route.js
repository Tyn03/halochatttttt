// Example: /pages/api/auth/users/[userId]/update.js

import { connectToDB } from "../../../../../mongodb/index";
import User from "../../../../../models/User";

export const POST = async (req, { params }) => {
    try {
        await connectToDB();
        const { userId } = params;
        console.log('User ID:', userId);

        const body = await req.json();
        console.log('Request Body:', body);

        const { username, profileImage } = body;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                profileImage,
            },
            { new: true }
        );

        console.log('Updated User:', updateUser);

        return new Response(JSON.stringify(updateUser), { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error.message);
        return new Response(JSON.stringify({ error: "Failed to update User" }), { status: 500 });
    }
};
