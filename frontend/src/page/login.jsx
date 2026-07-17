import React from 'react'
import { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";

const Login = () => {
    const [showpassword, setshowpassword]= useState(false);
    const [data, setData]  = useState({email: "", password:""});
    const navigate = useNavigate();
    const dispatch= useDispatch();

    const handleshowpassword= ()=> setshowpassword(prev=> !prev);
    const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

    const handlesumbit = async(e)=>{
        e.preventDefault();
        const {email, password}= data;
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
            }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body: JSON.stringify({email , password}),
            });
            const result = await response.json();

            if(!response.ok){
                toast.error(result.message || "Login Failed");
                return;
            }

            localStorage.setItem(
                "user",
                JSON.stringify(result.data.user)
            );

            toast.success("Login Successful 🎉");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
            
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!");
            
        }

        
    }


  return (
    
    <div className='min-h-screen  flex gap-20 items-center justify-center bg-gray-700     '>
        
        <div className='w-full max-w-md  items-center justify-center  py-4 px-4 rounded-lg bg-gray-800'>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl">
      👤 
       </div>
   
            <div className='flex flex-col gap-2'>
            <h1 className='text-3xl  flex flex-row text-center py-1 px-2 ml-20 text-white font-bold rounded-3xl'>📱 AI Interview <span className='text-violet-600'>Test</span>  👋  </h1>
            <p className='text-center text-xl   text-white px-2 py-2 rounded-lg text- '>Welcome to your AI Interview Preparation Platform. Experience realistic mock interviews, 
                get detailed performance analysis, improve your problem-solving and communication skills, and confidently prepare for placements, 
                internships, and job opportunities.🔒💬</p>
            </div>    
        </div>


        
        <div  className='w-full max-w-md bg-gray-900 rounded-lg p-5 '> 
            <h1 className='font-extrabold text-2xl text-green-800  text-center mt-2'>Welcome  back </h1>
            <p className='text-xl text-center mt-2 text-white '> Please login to your account </p>
            <form className='w-full  px-1 py-3 flex flex-col mt-8 space-y-5' onSubmit={handlesumbit}>
                
                <input 
                type='text'
                id='email'
                name='email'
                placeholder='👤 Enter the username' 
                className=" w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={data.email}
                onChange={handleOnChange}
                />

                <input
                type={showpassword ? "text" : "password"}
                id='password'
                name='password'
                placeholder='🔒 Enter the password'
                className='w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
                value={data.password}
                onChange={handleOnChange}
                />
                <button 
                type='submit'
                className=' w-full text-xl font-bold text-white  bg-green-500 py-3 px-2 rounded-2xl text-center  hover:bg-indigo-700 active:scale-[0.98] transition-all'>
                Login
                </button>
                <p className='text-sm text-violet-500 text-end  font-semibold mx-1 '> Forgot password</p>
                <p className='text-sm text-white font-serif text-center px-4 py-2'> 
                    Don't have an account?{" "} 
                    <Link to="/signup" className='text-blue-500 font-semibold'
                 >Signup</Link></p>


                
            </form>
        </div>
    </div>
  )
}

export default Login