

import { useEffect, useState, useRef } from 'react';
import './layout.css';
import axios from 'axios';
import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import background from '../assets/images/img2.jpeg'
const url = import.meta.env.VITE_BACKEND_URL;
const socket = io(url);

function Home() {

    useEffect(() => {
        document.title='Chat Box | Chat'
        document.body.style.background = `
        linear-gradient(#ff000040, #0000ff61), url(${background})
        `;
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
    }, []);
    const [messages, setMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const userId = sessionStorage.getItem("auth");
    const tok = sessionStorage.getItem("__tok");
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!userId || !tok) {
        navigate('/login');
      }
    }, [userId, tok, navigate]);


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
            const response = await axios.get(`${url}/getAllUsers`);
            setAllUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const fetchMessages = async (userId,selectedUser) => {
        try {
          const response = await axios.get(
            `${url}/messages/${userId}/${selectedUser}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
    };
    

    const sendMessage = async () => {
        try {
            await axios.post(`${url}/send-message`, {
                content: newMessage,
                sender: userId,
                receiver: selectedUser._id
            });
            setNewMessage("");

            socket.emit("receive_message", { content: newMessage, sender: userId, receiver: selectedUser._id });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleContactSelection = (contactId) => {
        setIsProfile(false)
        const selectedContact = allUsers.find(contact => contact._id === contactId);
        setSelectedUser(selectedContact);
        fetchMessages(userId,selectedContact._id);
    };


    const toggleSidebar = () => {
        const sidebar = document.querySelector(".action_menu");
        sidebar.classList.toggle("action_menuActive");
    };


    const logout=async()=>{
        try {
            await axios.put(`${url}/users/${userId}/logout`, { online: Boolean(false) }).then((res)=>{
                console.log(res.data);
                if (res.status === 200) {
                    sessionStorage.clear()
                    navigate('/login')
                }
            })

        } catch (error) {
            console.log(error);
        }
    }

    const [isProfile,setIsProfile]=useState(true)

    const [searchReferenceid, setSearchReferenceid] = useState('');
    const [dataSearch, setDataSearch] = useState([]);
    
    const SearchReferenceIdChange = () => {
        if (searchReferenceid) {
            const data = allUsers.filter((user) => user.reference === searchReferenceid);
            if (data.length > 0) {
                setDataSearch(data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'User Not Found',
                    text: 'No user matching the provided reference ID was found.',
                });
                setSearchReferenceid('')
                setDataSearch([]);

            }
        } else {
            setDataSearch([]);
        }
    };


    return (
        <div className="maincontainer py-3 py-md-5 py-xl-8 ">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-4 col-xl-4 chat">
                        <div className="card mb-sm-3 mb-md-0 contacts_card">
                            <div className="card-header d-flex align-items-center">
                                <div className='mx-2'>
                                    <label htmlFor="profil" style={{cursor:'pointer'}}><i className="fas fa-user-circle  text-light"></i></label>
                                    <input type="checkbox" className='d-none' id='profil'  onChange={(e)=>setIsProfile(e.target.checked)}/>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="Enter ID Here" value={searchReferenceid} className="form-control search" onChange={(e) => setSearchReferenceid(e.target.value)} />
                                    <div className="input-group-prepend" onClick={SearchReferenceIdChange}>
                                        <span className="input-group-text search_btn"><i className="fas fa-search"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body contacts_body">
                                <ul className='contacts'>
                                    {dataSearch.length > 0 ? (
                                        <>
                                        <p className='text-light text-uppercase'>Search</p>
                                        {dataSearch.map((contact, index) => (
                                            <li key={index} onClick={() => handleContactSelection(contact._id)}>
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" className="rounded-circle user_img" alt="User" />
                                                        <span className={`online_icon ${contact.online ? '' : 'offline'}`}></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>{contact.name}</span>
                                                        <p>{contact.status === 'online' ? 'Is online' : 'Is offline'}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        <hr className='text-light'/>
                                        </>
                                    ) : (
                                        <>
                                        {allUsers.map(contact => (
                                            <div key={contact._id}>
                                                {contact._id !== userId && (
                                                    <li onClick={() => handleContactSelection(contact._id)}>
                                                        <div className="d-flex bd-highlight">
                                                            <div className="img_cont">
                                                                <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" className="rounded-circle user_img" alt="User" />
                                                                <span className={`online_icon ${contact.online ? '' : 'offline'}`}></span>
                                                            </div>
                                                            <div className="user_info">
                                                                <span>{contact.name}</span>
                                                                <p>{contact.status === 'online' ? 'Is online' : 'Is offline'}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                            </div>
                                        ))}

                                        </>
                                    )}
                                </ul>
                            </div>
                            <div className="card-footer"></div>
                        </div>
                    </div>
                    <div className="col-md-8 col-xl-8 chat">
                        <div className="card">
                        {isProfile ? (
                                <>
                                    {allUsers.map((user,index) => {
                                        if(user._id === userId){
                                            return (
                                                <div  key={index}>
                                                    <div className="card-header msg_head">
                                                        <div className="d-flex bd-highlight">
                                                            <div className="img_cont">
                                                                <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" className="rounded-circle user_img" alt="User" />
                                                                <span className={`online_icon`}></span>
                                                            </div>
                                                            <div className="user_info">
                                                                <span>{user.name}</span>
                                                                <p>Est en ligne</p>
                                                            </div>
                                                        </div>
                                                        <span id="action_menu_btn" onClick={toggleSidebar}><i className="fas fa-ellipsis-v"></i></span>
                                                        <div className='action_menu'>
                                                            <ul>
                                                                <li onClick={logout}><i className="fas fa-ban"></i> LogOut</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="card-body msg_card_body">
                                                        <div className="container rounded mb-5 p-0">
                                                            <div className="row">
                                                                <div className="col-12 border-right">
                                                                    <div className='text-light'>
                                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                                            <h4 className="text-right">Profile</h4>
                                                                        </div>
                                                                        <div className="row mt-2">
                                                                            <div className="col-md-6"><label className="labels mb-3">Name</label><input style={{background:'none'}} type="text" className="form-control text-light py-3" placeholder="name" value={user.name} disabled/></div>
                                                                            <div className="col-md-6"><label className="labels mb-3">Username</label><input style={{background:'none'}}  type="text" className="form-control  text-light py-3" value={user.username} placeholder="username" disabled/></div>
                                                                        </div>
                                                                        <div className="row mt-3">
                                                                            <div className="col-md-12"><label className="labels mb-3">E-mail</label><input style={{background:'none'}}  type="text" className="form-control  text-light py-3" placeholder="E-mail" value={user.email} disabled/></div>
                                                                            <div className="col-md-12"><label className="labels mb-3 mt-3">ID</label><input style={{background:'none'}}  type="text" className="form-control  text-light py-3" placeholder="ID" value={user.reference} disabled/></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </>
                            ) : (
                                <>
                                    {selectedUser && (
                                        <div className="card-header msg_head">
                                            <div className="d-flex bd-highlight">
                                                <div className="img_cont">
                                                    <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" className="rounded-circle user_img" alt="User" />
                                                    <span className={`online_icon ${selectedUser.online ? '':'offline'}`}></span>
                                                </div>
                                                <div className="user_info">
                                                    {selectedUser && (
                                                        <>
                                                            <span>{selectedUser.name}</span>
                                                            <p>{selectedUser.online ? 'Est en ligne' : 'Est hors ligne'}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="video_cam">
                                                    <span><i className="fas fa-video"></i></span>
                                                    <span><i className="fas fa-phone"></i></span>
                                                </div>
                                            </div>
                                            <span id="action_menu_btn" onClick={toggleSidebar}><i className="fas fa-ellipsis-v"></i></span>
                                            <div className='action_menu'>
                                                <ul>
                                                    <li><i className="fas fa-user-circle"></i> View profile</li>
                                                    <li><i className="fas fa-users"></i> Add to close friends</li>
                                                    <li><i className="fas fa-plus"></i> Add to group</li>
                                                    <li><i className="fas fa-ban"></i> Block</li>
                                                    <li onClick={logout}><i className="fas fa-ban"></i> Log Out</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                    <div className="card-body msg_card_body">
                                        {messages.map(message => {
                                            const timestamp = new Date(message.timestamp);
                                            
                                            const time = timestamp.toLocaleTimeString();
                                            return (
                                                <>
                                                    <div key={message.id} className={`d-flex justify-content-${message.sender === userId ? 'end' : 'start'} mb-4`}>
                                                        <div className="img_cont_msg">
                                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" className="rounded-circle user_img_msg" alt="User" />
                                                        </div>
                                                        <div className={`msg_cotainer${message.sender === userId ? '_send' : ''}`}>
                                                            {message.content}
                                                            <span className="msg_time">{time}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div>
                                    <div className="card-footer">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
                                            </div>
                                            <textarea name="" className="form-control type_msg" placeholder="Type your message..." 
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                            ></textarea>
                                            <div className="input-group-append">
                                                <span className="input-group-text send_btn" onClick={sendMessage}><i className="fas fa-location-arrow"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;


