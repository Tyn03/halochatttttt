"use client";
import { EmailOutlined, PasswordOutlined, PersonOutline } from '@mui/icons-material'
import React from 'react'
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"
import toast from "react-hot-toast";

const Form = ({type}) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();
    const onSubmit = async (data)=>{
        console.log(data)
        if(type==="register"){
            const res = await fetch("/api/auth/register",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify(data),
            })
            if(res.ok){
                router.push("/");
            }
            if(res.error){
                toast.error("Something went wrong");
            }
        }
        if (type === "login") {
            const res = await signIn("credentials", {
              ...data,
              redirect: false,
            })
            if(res.ok){
                router.push("/chats");
            }
            if(res.error){
                console.log(res.error);
            }
        }
       

        
    }
  return (
    <div className='auth'>
      <div className='content'>
        <img src='assets/logo.png' alt='logo' className='logo' />
        
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
            
            {type=== 'register' && (
                <>
                    <div className='input'>
                    <input 
                    defaultValue=""
                    {...register("username",{
                        required : "Username is required",
                        
                    })}
                    type='text' placeholder='Username' className='input-field'/>
                    <PersonOutline sx={{ color: "#737373" }} />
                    </div>

                    {errors.username && (
                        <p className='text-red-500'>{errors.username.message}</p>
                    )}
                </>
                
            )}
            <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>


            <div>
                <div className='input'>
                    <input 
                    defaultValue=""
                    {...register("password",{
                        required : "Password is required",
                        validate : (value)=>{
                            if(value.length<5 || !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)){
                                return "Pasword muts be at least 3 characters and contain at least one special character"
                            }
                        }
                    })}
                    type='text' placeholder='Password' className='input-field'/>
                    <PasswordOutlined sx={{color : "#737373"}}/>
                </div>
                {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
                )}
            </div>
          

            <button className='button' type="submit">
                {type==='register' ? "Join Free" : "let's Chat"}
            </button>
            
        </form>

        {type==='register' ? (
            <Link href="/" className="link">
                <p className='text-center'> Already have an Account ? Sign In Here</p>
            </Link>
        ) : (
            <Link href="/register" className="link">
                <p className='text-center'> Don't have an Account ? RegisterHere</p>
            </Link>
        )}
      </div>
    </div>
  )
}

export default Form
