"use client"
import { AddPhotoAlternate } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { CldUploadButton } from 'next-cloudinary';
import MessageBox from './MessageBox'
import { pusherClient } from '../lib/pusher'
const ChatDetails = ({ chatId }) => {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [chat, setChat] = useState([]);
  const [otherMembers, setOtherMembers] = useState([]);
  const [text, setText] = useState("");
  
  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data);
      console.log('Chat data:', data);
      const filteredMembers = data?.members?.filter((member) => member._id !== currentUser._id);
      setOtherMembers(filteredMembers);

       
      console.log('Other members:', filteredMembers);
    } catch (error) {
      console.log(error);
      return new Response(error, { status: 500 });
    }
  }

  useEffect(() => {
    if (currentUser && chatId) {
      getChatDetails();
    }
  }, [currentUser, chatId]);
  const sendText = async()=>{
    try{
      const res = await fetch("/api/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          chatId,
          currentUserId:currentUser._id,
          text,
        })
      })
      setText(""); 
    }catch(error){
      console.log(error)
    }
  }
  const sendPhoto = async(result)=>{
    try{
      const res = await fetch("/api/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          chatId,
          currentUserId:currentUser._id,
          photo:result?.info?.secure_url
        })
      })
      
    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
    pusherClient.subscribe(chatId)
    const handleMessage = async(newMessage)=>{
      setChat((prevChat)=>{
        return{
          ...prevChat,
          messages:[...prevChat.messages,newMessage],
        };
      });
    }
    pusherClient.bind("new-message",handleMessage);
    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  },[chatId])

  /* Scrolling down to the bottom when having the new message */

  const bottomRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);

  return (
    <div className='chat-details'>
      <div className='chat-header'>
        {chat?.isGroup ? (
            <>
                <Link href={`/chats/${chatId}/group-info`}>
                <img src={chat?.groupPhoto || "/assets/group.png"} alt="group-photo" className='profilePhoto' />
                <div className="text">
                <p>{chat?.name} &#160; &#183; &#160; {chat?.members?.length}  members</p>
                </div>
                </Link>
            </>
        ) : (
          otherMembers.length > 0 && (
            <>
              <img src={otherMembers[0].profileImage || "/assets/person.jpg"} alt="profile photo" className='profilePhoto' />
              <div className="text">
                <p>{otherMembers[0].username}</p>
              </div>
            </>
          )
        )}
      </div>

      <div className='chat-body'>
        {chat?.messages?.map((message,index)=>(
          <MessageBox key={index} message={message} currentUser={currentUser}/>
        ))}
        <div ref={bottomRef}/>
      </div>

      <div className='send-message'>
        <div className='prepare-message'>
        <CldUploadButton options={{maxFiles:1}} onUpload={sendPhoto} uploadPreset="z8obk3jl">
          <AddPhotoAlternate sx={{ fontSize: "35px", color: "#737373", cursor: "pointer", "&:hover": { color: "red" } }} />
          </CldUploadButton>
          <input 
            type="text" 
            placeholder='write a message...'
            className='input-field'
            value={text}
            onChange={(e)=>setText(e.target.value)}
            required
          />
        </div>
        <img src="/assets/send.jpg" alt="send" className='send-icon' onClick={sendText} />
      </div>
      
    </div>
  )
}

export default ChatDetails;
