"use client"
import React from 'react'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
const TopBar = () => {
    const pathname = usePathname();
    const {data : session} = useSession();
    const user = session?.user;
    const handleLogout = async()=>{
        signOut({callbackUrl:"/"})
    }
   
  return (
    <div className='topbar'>
        <Link href="/chats">
        <img src="/assets/logo.png" alt="logo" className='logo' />
        </Link>

        <div className='menu'>
            <Link href="/chats" className={`${pathname==="/chats" ? "text-red-1" : ""} text-heading4-bold`}>Chats</Link>
            <Link href="/contacts" className={`${pathname==="/contacts" ? "text-red-1" : ""} text-heading4-bold`}>Contacts</Link>

        </div>

        <Logout sx={{color: "#737373",cursor : "pointer"}} onClick={handleLogout}/>

        <Link href="/profile">
            <img src={user?.profileImage || "/assets/person.jpg"} alt="profile" className='profilePhoto'/>
        </Link>
      
    </div>
  )
}

export default TopBar
