import React from "react";

const MessageInput = () => {
  return (
    <div className="p-3 border-t flex items-center gap-2 bg-white">
      <input
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border rounded-full text-sm"
      />
      <button className="text-xl">😊</button>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-full">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
