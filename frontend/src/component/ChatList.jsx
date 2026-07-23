import React from "react";

const users = [
  { name: "Ramesh", message: "Hello..." },
  { name: "Rahul", message: "Are you there?" },
  { name: "Anuj", message: "Typing..." },
];

const ChatList = () => {
  return (
    <div className="w-1/3 bg-white border-r flex flex-col">

      {/* Header */}
      <div className="p-4 font-semibold text-lg border-b">
        Chats
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          placeholder="Search"
          className="w-full px-3 py-2 rounded-md border text-sm"
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
              {user.name[0]}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">
                {user.message}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ChatList;
