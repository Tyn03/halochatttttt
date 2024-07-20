"use client"
import React, { useEffect,useState } from 'react'
import { useForm } from "react-hook-form";
import {  PersonOutline } from '@mui/icons-material'
import {useSession} from 'next-auth/react'
import { CldUploadButton } from 'next-cloudinary';
const Profile = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
      } = useForm()
      const [loading,setLoading] = useState(true);
      const {data:session} = useSession();
      const user = session?.user;
      useEffect(()=>{
        if(user){
            reset({
                username:user?.username,
                profileImage:user?.profileImage,
            })
        }
        setLoading(false);
    },[user])
     const uploadPhoto = (result)=>{
        setValue("profileImage",result?.info?.secure_url)
     }

     const updateUser = async(data)=>{
        try{
            const res = await fetch(`/api/users/${user._id}/update`,{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify(data), 
            })
            setLoading(false);
            window.location.reload();
        }catch(error){
            console.log(error) 
        }
     }

    
    
  return (
    <div className='profile-page'>
        <h1 className='text-heading3-bold'>Edit Your Profile</h1>
        <form className='edit-profile' onSubmit={handleSubmit(updateUser)}>
            <div className='input'>
                <input
                    defaultValue=""
                    {...register("username",{
                        required : "username is required",
                    })}
                    type="text" placeholder='Username' className='input-field' 
                />
                <PersonOutline sx={{color : "#737373"}}/>
            </div>

            <div className='flex items-center justify-between'>
                <img src={watch("profileImage") || user?.profileImage || "/assets/person.jpg"} alt='profile' className='w-40 h-40 rounded-full'/>
                <CldUploadButton options={{maxFiles:1}} onUpload={uploadPhoto} uploadPreset="z8obk3jl">
                <p className='text-body-bold'>Upload new photo</p>
                </CldUploadButton>

               
                
            </div>

            <button className='btn' type="submit" >Save changes</button>
            
        </form>
    </div>
  )
}

export default Profile
