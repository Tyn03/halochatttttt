import React from 'react'
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
const ChatBox = ({ chat, currentUser, currentChatId }) => {
    const otherMember = chat?.members?.filter((member) => member._id != currentUser._id)
    const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];
    const seen = lastMessage?.seenBy?.find((member) => member._id === currentUser._id)
    const router = useRouter();

    return (
        <div className='chat-box' onClick={() => router.push(`/chats/${chat._id}`)}>
            <div className='chat-info'>
                {chat?.isGroup ? (
                    <img src={chat?.groupPhoto || "/assets/group.png"} alt="group-photo" className='profilePhoto' />
                ) : (
                    <img src={otherMember[0].profileImage || "/assets/person.png"} alt="profile-photo" className='profilePhoto' />
                )}

                <div className='flex flex-col gap-1'>
                    {chat?.isGroup ? (
                        <p className='text-base-bold'>{chat?.name}</p>
                    ) : (
                        <p className='text-base-bold'>{otherMember[0]?.username}</p>
                    )}

                    {!lastMessage && (
                        <p className='text-small-bold'>Started a chat</p>
                    )}

                    {lastMessage?.photo ? (
                        lastMessage?.sender?._id === currentUser._id ? (
                            <p className="text-small-medium text-grey-3">You sent a photo</p>
                        ) : (
                            <p
                                className={`${seen ? "text-small-medium text-grey-3" : "text-small-bold"
                                    }`}
                            >
                                Received a photo
                            </p>
                        )
                    ) : (
                        <p
                            className={`last-message ${seen ? "text-small-medium text-grey-3" : "text-small-bold"
                                }`}
                        >
                            {lastMessage?.text}
                        </p>
                    )}

                </div>
            </div>
            <p className='text-base-light text-grey-3'>
                {!lastMessage && format(new Date(chat?.createdAt), "p")}
            </p>

        </div>
    )
}

export default ChatBox
