"use client"
import { CheckCircle, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
const Contacts = () => {
  const [contacts,setContacts] = useState([]);
  const {data:session} = useSession();
  const currentUser = session?.user;
  const [search,setSearch] = useState("");

  const getContacts = async()=>{
    const res = await fetch(search!=="" ?  `api/users/searchContact/${search}` : '/api/users');
    
    const data = await res.json();
    console.log(data)
    setContacts(data.filter((contact) => contact._id !== currentUser._id));
  }
  useEffect(()=>{
    if(currentUser){
      getContacts();
    }
    
  },[currentUser,search])

  /* SELECT CONTACT*/
  const [selectedContacts,setSelectedContacts] = useState([]);
  const isGroup = selectedContacts.length>1;
  const [name, setName] = useState("");
  const [nameG2, setNameG2] = useState("");
  const handleSelect = async(contact)=>{
    if(selectedContacts.includes(contact)){
      setSelectedContacts((previousContacts)=>(
        previousContacts.filter((item)=>item!==contact)
      ))
    }
    else{
      setSelectedContacts((previousContacts)=>[
        ...previousContacts,
        contact,
      ]
      )
    }
    
  }
  const router = useRouter();
  const createChat = async()=>{
    
      const res = await fetch("/api/chats",{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
        },
        body:JSON.stringify({
          currentUserId:currentUser._id,
          members:selectedContacts.map((contact)=>contact._id),
          isGroup,
          name: isGroup ? name : nameG2,
        }),
      });
      // const chatt = res.json();
      // console.log(chatt)
      const chat = await res.json();
      if(res.ok){
        router.push(`/chats/${chat._id}`);
      }
    // }catch(error){
    //   console.log(error)
    //   return new Response(error,{status:200})
    // }
  }

  return (
    <div className='create-chat-container'>
      <input placeholder='Search contact...' className='input-search' value={search} onChange={(e)=>setSearch(e.target.value)}/>
      <div className='contact-bar'>
        <div className='contact-list'>
          <div className='text-body-bold'>Select or Delete</div>
            <div className='flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar'>
              {contacts.map((user,index)=>(
                  <div key={index} className='contact' onClick={()=>handleSelect(user)} value={nameG2} onChange={(e)=>setNameG2(e.target.value)}>
                    {selectedContacts.find((item)=>item===user) ? (
                      <CheckCircle sx={{color:"red"}}/>
                    ) : <RadioButtonUnchecked/> }
                    
                    
                    <img src={user.profileImage || "/assets/person.jpg"} alt="profile" className='profilePhoto'/>
                    <p className='text-base-bold'>{user.username}</p>
                  </div>
                  
                ))}
                
            </div>   
        </div>

        

        <div className='create-chat'>
          {isGroup && (
              <div className='flex flex-col gap-3'>
              <p className='text-body-bold'>Group Chat Name</p>
              <input 
                placeholder="Enter group chat name..."
                className="input-group-name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                
              /> 
              <p className="text-body-bold">Members</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedContacts.map((contact, index) => (
                      <p className="selected-contact" key={index}>
                        {contact.username}
                      </p>
                    ))}
                  </div>
              </div>
          )}
          
          
          
          
            <button className='btn' onClick={createChat}>
              FIND OR START A NEW CHAT
            </button>
        </div>
      </div>
      
    </div>
  )
}

export default Contacts
