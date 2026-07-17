import React from "react";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  return (
    <div className="flex-1 p-3 overflow-y-auto space-y-2 text-white">
            {/* messages will appear here */}
            {messages.map((m)=>{
              const mine  = m.sender ===m.Username;
              return 
            })}
            
            </div>
   
  );
};

export default ChatWindow;
