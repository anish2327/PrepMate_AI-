import React from 'react'
import { useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";

import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {

  const [showpassword, setshowpassword]= useState(false);
  const [showConfrimPassword, setConfrimPassword] = useState(false);
  const [data, setData]= useState({
    fullname :"",
    email: "",
    password : "",
    confrimpassword : "",
    checkbox: false,

  });
  const navigate= useNavigate();
  const handleshowpassword= ()=>{
    setshowpassword((prev)=> !prev );
  }
  const handleshowConfrimPassword= ()=>{
    setConfrimPassword((prev)=> !prev);
  }
  const handleOnChange= (e)=>{
    const {name, type, checked, value}= e.target;
    setData((prev)=>{
      return {
        ...prev,
        [name]: type==="checkbox" ? checked: value,

      };
    });
  };
  
  const handlesumbit= async (e)=>{
    e.preventDefault();

    const {fullname, email, password, confrimpassword, checkbox}= data;

    if(!fullname || !email || !password || !confrimpassword  || !checkbox){
      toast.error("please provide all details");
      return;
    }

    if(password !== confrimpassword){
    toast.error("Password don't match");
    return;
  }

  try {
    const sign= `${import.meta.env.VITE_API_URL}/signup`;
    const payload = {
      name : fullname,
      email,
      password,
      confrimpassword,

    };
    const  response =  await fetch(sign,{
      method : "POST",
      headers : {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    });
    const result= await response.json();

    if(!response.ok){
      toast.error(result.message || "signup failed");
      return;
    }
    toast.success(result.message || "Signup successfully");
    navigate("/login");

    
  } catch (error) {
    console.error(error);
    toast.error("something went wrong");
    
  }
};
  

  return (
    <div className='min-h-screen  flex gap-20 items-center justify-center bg-gray-700    '>
    <div className='w-full max-w-md bg-gray-900 rounded-lg p-5' >
            <h1 className='font-extrabold text-3xl text-green-800  text-center mt-2'> Register  </h1>
            <h2 className='font-extrabold text-2xl text-amber-400  text-center mt-2'> Let's get started <span  className='text-xl text-white'> You and Your friends always Connected 💬💬</span></h2>
            <form className='w-full  px-1 py-3 flex flex-col mt-8 space-y-5 ' onSubmit={handlesumbit}>
            <input
            type='text'
            id='fullname'
            name='fullname'
            placeholder=' Full name '
            className='w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
            value={data.fullname}
            onChange={handleOnChange}
            />

            <input
            type='text'
            id='email'
            name='email'
            placeholder='email'
            className='w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
            value={data.email}
            onChange={handleOnChange}
            />


            <div className='relative w-full'>
            <input
             type={showpassword ? "text" : "password"}
            id='password'
            name='password'
            placeholder='Password'
            className='w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
            value= {data.password}
            onChange={handleOnChange}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl cursor-pointer text-gray-700 hover:text-indigo-600" onClick={handleshowpassword}>{showpassword  ? <BiShow/> : <BiHide/>}</span>
            </div>


            <div className=" relative w-full ">
            <input
             type={showConfrimPassword? "text" : "password"}
            id='confirmpassword'
            name='confrimpassword'
            placeholder='Confrim Password'
            className='w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
            value={data.confrimpassword}
            onChange={handleOnChange}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl cursor-pointer text-gray-700 hover:text-indigo-600" onClick={handleshowConfrimPassword}>{showConfrimPassword  ? <BiShow/> : <BiHide/>}</span>
            </div>

            <div>
               <label  className=" text-gray-400">
           <input
            type='checkbox'
            id='agree'
            name='checkbox'
            checked={data.checkbox}
            onChange={handleOnChange}
            className="mt-1 h-4 w-4 accent-indigo-600 cursor-pointer"
            />
             I agree with <span className='text-indigo-700'> 
                Terms and Conditions </span> and the <span className='text-indigo-700'>Privacy policy</span>
            </label>
            </div>
            
             <button id='sumbit' className='w-full text-xl font-bold text-white  bg-blue-500 py-3 px-2 rounded-2xl text-center  hover:bg-indigo-700 active:scale-[0.98] transition-all'>
             Sign up
             </button>
             <p className='text-white text-center font-bold'>Already have an account ? <Link to={"/login"} className='text-blue-500'>Login</Link>
             </p>
            </form>
        </div>
    </div>
  )
}

export default Signup