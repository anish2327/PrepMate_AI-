import React, { useState } from 'react'


const Home = () => {
  const [Username, setUsername]= useState("");
  const [messages, setmessage]= useState([]);
  const [text,settext]= useState('');

  function sendmessage(){
    const t= text.trim();
    if(!t) return;
    const msg = { 
      id: Date.now(),
      text: t,

    }
    setmessage((m)=>[...m, msg])
      

    
  }

  return (
   // whole screen
    <div className=' min-h-screen  bg-zinc-900 flex items-center justify-center'>   
       <div className='  bg-gray-800 w-full max-w-md h-[80vh] rounded-xl flex flex-col shadow-lg '>

            {/* header of chat app */}

            <div className='flex items-center gap-3 py-4 px-3 border-b border-gray-700'>
              <div className=' h-10 w-10   bg-green-600  flex items-center justify-center rounded-full text-white font-bold'>
                R 
              </div>
              <h2 className='text-white text-2xl font-semibold'>
                 Realtime Group
              </h2>
              <p className=' text-white ml-20'>Sign In<span className='text-blue-500'> username</span> </p>
              
            </div>
            {/* chatArea messages will appear here */}
             <div className="flex-1 p-3 overflow-y-auto space-y-2 text-white">
              {messages.map((m)=>{
                const mine  = m.sender ===m.Username;
                return (
                  <div
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                    className={`max-w-[78%] p-3 my-2 rounded-[18%] `}>

                    </div>
                  </div>

                  

                );
            })}
            
            </div>

            


            {/* bottom message tab and send buuton */}
            <div className=' border-t border-gray-700 p-2 '>
              <div className='flex items-center gap-2 bg-white rounded-3xl py-3 px-2 '>
                <input
                type='text'
                placeholder='message'
                className='flex-1 px-2  resize-none outline-0 placeholder-black'

                />
                <button 
                onClick={sendmessage}
                className='bg-amber-400 rounded-full p-1 outline-0  font-semibold'> send</button>
              </div>
            </div>
           
      </div>
    </div>

  )
}

export default Home