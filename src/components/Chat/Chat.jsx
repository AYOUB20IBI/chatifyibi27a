// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000'); // Replace with your server URL

// function ChatRoom() {
//   const [messages, setMessages] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const userID = sessionStorage.getItem('auth');

//   useEffect(() => {
//     fetchUsers();
//     socket.on("receive_message", (message) => {
//       console.log(message);
//       setMessages(prevMessages => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off("receive_message");
//     };
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/getAllUsers`);
//       setAllUsers(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/messages/${userID}/${selectedUser}`);
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const sendMessage = async () => {
//     try {
//       await axios.post('http://localhost:3000/send-message', {
//         content: newMessage,
//         sender: userID,
//         receiver: selectedUser
//       });
//       setNewMessage('');
//       fetchMessages(); // Refresh messages after sending
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const handleUserSelection = (userId) => {
//     setSelectedUser(userId);
//     fetchMessages();
//   };

//   return (
//     <div>
//       <h1>Chat Room</h1>
//       <div>
//         {messages.map((message, index) => (
//           <div key={index}>
//             {message.sender === userID ? (
//               <div style={{ textAlign: 'right' }}>
//                 <span>You: {message.content}</span>
//               </div>
//             ) : (
//               <div style={{ textAlign: 'left' }}>
//                 <span>{allUsers.find(user => user._id === message.sender)?.name}: {message.content}</span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <div>
//         <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//       <br />
//       <br />
//       <div>
//         {allUsers.map((user, index) => (
//           <div key={index}>
//             {user._id !== userID && (
//               <button className='btn btn-danger' onClick={() => handleUserSelection(user._id)}>
//                 {user.name}
//               </button>
//             )}
//             <br/><br/>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ChatRoom;

// ChatRoom.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = sessionStorage.getItem("auth");

  useEffect(() => {
    fetchUsers();

    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllUsers");
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/messages/${userId}/${selectedUser}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post("http://localhost:3000/send-message", {
        content: newMessage,
        sender: userId,
        receiver: selectedUser
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUser(userId);
    fetchMessages();
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.sender === userId ? (
              <div style={{ textAlign: "right" }}>
                <span>You: {message.content}</span>
              </div>
            ) : (
              <div style={{ textAlign: "left" }}>
                <span>
                  {allUsers.find((user) => user._id === message.sender)?.name}:{" "}
                  {message.content}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <br />
      <br />
      <div>
        {allUsers.map((user) => (
          <div key={user._id}>
            {user._id !== userId && (
              <button onClick={() => handleUserSelection(user._id)}>
                {user.name}
              </button>
            )}
            <br />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatRoom;
