import { useEffect, useRef, useState } from "react";
import "./conversation.css";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import copy from "copy-to-clipboard";
const url = import.meta.env.VITE_BACKEND_URL;
import { toast } from 'react-toastify';

function Conversation() {
  useEffect(() => {
    document.title = "CHATIFY IBI27A | Chat";
  }, []);
  const [messages, setMessages] = useState([]);
  const [recieverId, setRecieverId] = useState({
    recieverid: "",
    conversationID: "",
  });
  const [allUsers, setAllUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfile, setIsProfile] = useState(true);
  const [socket, setSocket] = useState(null);
  // const [notifications, setNotifications] = useState({ unreadCount: 0 });
  const userId = sessionStorage.getItem("auth");
  const tok = sessionStorage.getItem("__tok");
  const navigate = useNavigate();
  console.log("messages>>>>", messages);

  const messageRef = useRef();

  useEffect(() => {
    if (!userId || !tok) {
      navigate("/login");
    }
  }, [userId, tok, navigate]);

  useEffect(() => {
    setSocket(io(url));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", userId);
    socket?.on("getUsers", async (users) => {
      fetchConversations();
      console.log("activeUsers =>>", users);
    });

    socket?.on("getMessage", (newMessage) => {
      console.log("getMessage =>>", newMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: newMessage.user,
          conversationId: newMessage.conversationId,
          message: newMessage.message,
        },
      ]);
    });

    // socket?.on("notification", (newMessage) => {
    //   console.log("notification =>>", newMessage);
    //   // setNotifications(newMessage.unreadCount)
    //   setNotifications(prev => ({
    //     ...prev,
    //     unreadCount: newMessage.unreadCount
    //   }));
    // });
  }, [socket]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/users`);
      console.log("users", res);
      setAllUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".action_menu");
    sidebar.classList.toggle("action_menuActive");
  };

  const logout = async () => {
    try {
      await axios
        .put(`${url}/users/${userId}/logout`, { online: Boolean(false) })
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            sessionStorage.clear();
            navigate("/");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${url}/conversation/${userId}`);
      console.log("res data conversation:", res);
      setConversations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
    // fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await axios.get(`${url}/users/${userId}`);
      console.log("contacts", res.data);
      setContacts(res.data);
    };
    fetchContacts();
  }, []);

  const sendMessage = async () => {
    console.log("sender id", recieverId.recieverid);
    socket.emit("sendMessage", {
      conversationId: recieverId.conversationID,
      senderId: userId,
      message: newMessage,
      receiverId: recieverId.recieverid,
    });

    await axios.post(`${url}/message`, {
      conversationId: recieverId.conversationID,
      senderId: userId,
      message: newMessage,
      receiverId: recieverId.recieverid,
    });
    setNewMessage("");
    fetchConversations();
    fetchMessages(recieverId.conversationID, recieverId.recieverid);
  };

  const fetchMessages = async (conversationId, reciever) => {
    setIsProfile(false);
    setRecieverId({ recieverid: reciever, conversationID: conversationId });
    const res = await fetch(
      `${url}/message/${conversationId}?senderId=${userId}&&receiverId=${reciever}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    console.log("messages =>", resData);
    setMessages(resData);
  };

  const handleContactSelection = (contactId) => {
    setIsProfile(false);
    const selectedContact = allUsers.find(
      (contact) => contact._id === contactId
    );
    setSelectedUser(selectedContact);
  };

  const [searchReferenceid, setSearchReferenceid] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [errorSearch, setErrorSearch] = useState("");

  const SearchReferenceIdChange = () => {
    if (searchReferenceid) {
      const data = allUsers.filter(
        (user) => user.reference === searchReferenceid
      );
      if (data.length > 0) {
        setDataSearch(data);
        setErrorSearch("");
      } else {
        Swal.fire({
          icon: "error",
          title: "User Not Found",
          text: "No user matching the provided reference ID was found.",
        });
        setSearchReferenceid("");
        setDataSearch([]);
      }
    } else {
      setDataSearch([]);
      setErrorSearch("No Conversation Found");
      setTimeout(() => {
        setErrorSearch("");
      }, 2000);
    }
  };

  const [showProfile, setShowProfile] = useState([]);

  const ShowInformation = async (id) => {
    const data = await allUsers.filter((user) => user._id === id);
    setShowProfile(data);
  };

  // const fetchNotifications=async()=>{
  //   const res = await axios.get(`${url}/notifications/${userId}`);
  //   console.log("nottification users",res);
  //   setNotifications({unreadCount:res.data.unreadCount})
  // }

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji.native);
    console.log("Emoji sélectionné :", newMessage);
  };



  const CopyTextBot = (text, e) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        e.target.classList.add("activeColor");
        toast.success('Copied'); 
        setTimeout(() => {
          e.target.classList.remove("activeColor");
        }, 1000);
      })
      .catch((error) => {
        console.error('Error copying text:', error);
      });
  };
  
  const OnCall = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Service Unavailable',
      text: 'This service is currently in trial status and is not available at the moment. Please try again later.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#007bff'
    });
  };
  

  return (
    <div className="maincontainer">
      <div className="px-3">
        <div className="row justify-content-center">
          <div className="col-md-4 col-xl-4 chat">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
              <div className="card-header d-flex align-items-center">
                <div className="mx-2">
                  <label htmlFor="profil" style={{ cursor: "pointer" }}>
                    <i className="bi bi-person-bounding-box text-light"></i>
                  </label>
                  <input
                    type="checkbox"
                    className="d-none"
                    id="profil"
                    onChange={(e) => setIsProfile(e.target.checked)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter ID Here"
                    value={searchReferenceid}
                    className="form-control search"
                    onChange={(e) => setSearchReferenceid(e.target.value)}
                  />
                  <div
                    className="input-group-prepend"
                    onClick={SearchReferenceIdChange}
                  >
                    <span className="input-group-text search_btn">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body contacts_body">
                <ul className="contacts">
                  {dataSearch.length > 0 ? (
                    <>
                      <p className="text-light text-uppercase">Search</p>
                      {dataSearch.map((user, index) => (
                        <div key={index}>
                          {user._id !== userId ? (
                            <li
                              onClick={() => {
                                fetchMessages("new", user._id);
                                handleContactSelection(user._id);
                              }}
                            >
                              <div className="d-flex bd-highlight">
                                <div className="img_cont">
                                  {user.image === "" && !user.image ? (
                                    <>
                                      <img
                                        src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                        className="rounded-circle user_img"
                                        alt="User"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={`/src/assets/face/${user.image}`}
                                        className="rounded-circle user_img"
                                        alt="face"
                                      />
                                    </>
                                  )}
                                  <span
                                    className={`online_icon ${
                                      user.online ? "" : "offline"
                                    }`}
                                  ></span>
                                </div>
                                <div className="user_info">
                                  <span>{user.username}</span>
                                  <p>
                                    {user.status === "online"
                                      ? "Is online"
                                      : "Is offline"}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ) : (
                            <>
                              <p className="text-light text-center">
                                That's You
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <p className="text-light text-center">{errorSearch}</p>
                    </>
                  )}

                  <p className="text-light text-start">
                    MY Conversation{" "}
                    <i className="bi bi-chat-right-heart-fill"></i>
                  </p>
                  <hr />
                  {conversations.length > 0 ? (
                    <>
                      {conversations.map((user, index) => (
                        <div key={index}>
                          <li
                            onClick={() => {
                              fetchMessages(
                                user.conversationId,
                                user.receiver._id
                              );
                              handleContactSelection(user.receiver._id);
                            }}
                          >
                            <div className="d-flex bd-highlight">
                              <div className="img_cont position-relative">
                                {user.receiver.image === "" ||
                                !user.receiver.image ? (
                                  <img
                                    src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                    className="rounded-circle user_img"
                                    alt="User"
                                  />
                                ) : (
                                  <img
                                    src={`/src/assets/face/${user.receiver.image}`}
                                    className="rounded-circle user_img"
                                    alt="face1"
                                  />
                                )}
                                <span
                                  className={`online_icon position-absolute bottom-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle ${
                                    user.receiver.online ? "" : "bg-secondary"
                                  }`}
                                ></span>
                              </div>
                              <div className="user_info ms-3">
                                <span>{user.receiver.username}</span>
                                <p>
                                  {user.receiver.status === "online"
                                    ? "Is online"
                                    : "Is offline"}
                                </p>
                              </div>
                              {/* {notifications.unreadCount !==0 &&
                                <div className="ms-auto p-2">
                                  <button className="btn btn-primary" style={{
                                    background: '#FF5722',
                                    border: 'none',
                                    outline: 'none',
                                    borderRadius: '50%',
                                  }}>{notifications.unreadCount}</button>
                                </div>
                              }  */}
                            </div>
                          </li>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <p className="text-light text-center">No Conversation</p>
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
                  {allUsers.map((user, index) => {
                    if (user._id === userId) {
                      return (
                        <div key={index}>
                          <div className="card-header msg_head">
                            <div className="d-flex bd-highlight">
                              <div className="img_cont">
                                {user.image === "" || !user.image ? (
                                  <>
                                    <img
                                      src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                      className="rounded-circle user_img"
                                      alt="User"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <img
                                      src={`/src/assets/face/${user.image}`}
                                      className="rounded-circle user_img"
                                      alt="face1"
                                    />
                                  </>
                                )}
                                <span className={`online_icon`}></span>
                              </div>
                              <div className="user_info">
                                <span>{user.name}</span>
                                <p>Est en ligne</p>
                              </div>
                            </div>
                            <span id="action_menu_btn" onClick={toggleSidebar}>
                              <i className="fas fa-ellipsis-v"></i>
                            </span>
                            <div className="action_menu">
                              <ul>
                                <li onClick={logout}>
                                  <i className="bi bi-box-arrow-right"></i>{" "}
                                  LogOut
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="card-body msg_card_body ">
                            <div className="container rounded mb-5 p-0">
                              <div className="row">
                                <div className="col-12 border-right">
                                  <div className="text-light">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <h4 className="text-right">Profile</h4>
                                    </div>
                                    <div className="row mt-2">
                                      <div className="col-md-6">
                                        <label className="labels mb-3">
                                          Name
                                        </label>
                                        <input
                                          style={{ background: "none" }}
                                          type="text"
                                          className="form-control text-light py-3"
                                          placeholder="name"
                                          value={user.name}
                                          disabled
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label className="labels mb-3">
                                          Username
                                        </label>
                                        <input
                                          style={{ background: "none" }}
                                          type="text"
                                          className="form-control  text-light py-3"
                                          value={user.username}
                                          placeholder="username"
                                          disabled
                                        />
                                      </div>
                                    </div>
                                    <div className="row mt-3">
                                      <div className="col-md-12">
                                        <label className="labels mb-3">
                                          E-mail
                                        </label>
                                        <input
                                          style={{ background: "none" }}
                                          type="text"
                                          className="form-control  text-light py-3"
                                          placeholder="E-mail"
                                          value={user.email}
                                          disabled
                                        />
                                      </div>
                                      <div className="col-md-12">
                                        <label className="labels mb-3 mt-3">
                                          ID
                                        </label>
                                        <input
                                          style={{ background: "none" }}
                                          type="text"
                                          className="form-control  text-light py-3"
                                          placeholder="ID"
                                          value={user.reference}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </>
              ) : (
                <>
                  {selectedUser && (
                    <div className="card-header msg_head">
                      <div className="d-flex bd-highlight">
                        <div className="img_cont">
                          {selectedUser.image === "" || !selectedUser.image ? (
                            <>
                              <img
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() =>
                                  ShowInformation(selectedUser._id)
                                }
                                src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                className="rounded-circle user_img"
                                alt="User"
                              />
                            </>
                          ) : (
                            <>
                              <img
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() =>
                                  ShowInformation(selectedUser._id)
                                }
                                src={`/src/assets/face/${selectedUser.image}`}
                                className="rounded-circle user_img"
                                alt="face1"
                              />
                            </>
                          )}
                          <span
                            className={`online_icon ${
                              selectedUser.online ? "" : "offline"
                            }`}
                          ></span>
                        </div>
                        <div className="user_info">
                          {selectedUser && (
                            <>
                              <span>{selectedUser.name}</span>
                              <p>
                                {selectedUser.online
                                  ? "Est en ligne"
                                  : "Est hors ligne"}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="video_cam">
                          <span onClick={()=>OnCall()}>
                            <i className="fas fa-video"></i>
                          </span>
                          <span onClick={()=>OnCall()}>
                            <i className="fas fa-phone"></i>
                          </span>
                        </div>
                      </div>
                      <span id="action_menu_btn" onClick={toggleSidebar}>
                        <i className="fas fa-ellipsis-v"></i>
                      </span>
                      <div className="action_menu">
                        <ul>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => ShowInformation(selectedUser._id)}
                          >
                            <i className="fas fa-user-circle"></i> View Profile
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="card-body msg_card_body">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        return (
                          <>
                            <div
                              key={message.id}
                              className={`d-flex justify-content-${
                                message.user._id === userId ? "end" : "start"
                              } mb-4`}
                            >
                              <div className="img_cont_msg">
                                {message.user.image === "" ||
                                !message.user.image ? (
                                  <>
                                    <img
                                      src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                      className="rounded-circle user_img_msg"
                                      alt="User"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <img
                                      src={`/src/assets/face/${message.user.image}`}
                                      className="rounded-circle user_img_msg"
                                      alt="face1"
                                    />
                                  </>
                                )}
                              </div>
                              <div
                                className={`msg_cotainer${
                                  message.user._id === userId ? "_send" : ""
                                }`}
                              >
                                {message.message}
                                {/* <span className="msg_time">{time}</span> */}
                                <span
                                  id="btn-copy-coler"
                                  className="msg_time"
                                  onClick={(e) =>
                                    CopyTextBot(message.message, e)
                                  }
                                >
                                  <i className="bi bi-clipboard-fill"></i>
                                </span>
                              </div>
                            </div>
                            <div ref={messageRef}></div>
                          </>
                        );
                      })
                    ) : (
                      <p className="text-light text-center">
                        There are no messages
                      </p>
                    )}
                  </div>
                  {showEmojiPicker && (
                    <Picker onEmojiSelect={handleEmojiSelect} data={data} />
                  )}
                  <div className="card-footer border-top">
                    <div className="input-group">
                      <div className="input-group-append">
                        <span className="input-group-text attach_btn">
                          <span className="m-1">
                            <button
                              onClick={toggleEmojiPicker}
                              className="border-0"
                              style={{ background: "none" }}
                            >
                              <i
                                className="bi bi-emoji-sunglasses-fill"
                                style={{ color: "yellow" }}
                              ></i>
                            </button>
                          </span>
                        </span>
                      </div>

                      <textarea
                        name=""
                        className="form-control type_msg"
                        placeholder="Message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      ></textarea>
                      <div className="input-group-append">
                        <span
                          className="input-group-text send_btn"
                          onClick={sendMessage}
                        >
                          <i className="fas fa-location-arrow"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div
            className="modal-content"
            style={{
              borderRadius: "4px",
              background: "#97979747",
              backdropFilter: "blur(50px)",
            }}
          >
            <div className="modal-header">
              <span
                className="text-light w-100 text-end"
                style={{ cursor: "pointer" }}
                aria-label="Close"
                data-bs-dismiss="modal"
              >
                <i className="bi bi-x-circle fs-4"></i>
              </span>
            </div>
            <div className="modal-body ">
              {showProfile.map((user, index) => (
                <div key={index} className="container rounded mb-5 p-0">
                  <div className="row">
                    <div className="col-12 border-right">
                      <div className="text-light">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="text-right">Profile</h4>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <label className="labels mb-3">Name</label>
                            <input
                              style={{ background: "none" }}
                              type="text"
                              className="form-control text-light py-3"
                              placeholder="name"
                              value={user.name}
                              disabled
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="labels mb-3">Username</label>
                            <input
                              style={{ background: "none" }}
                              type="text"
                              className="form-control  text-light py-3"
                              value={user.username}
                              placeholder="username"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <label className="labels mb-3">E-mail</label>
                            <input
                              style={{ background: "none" }}
                              type="text"
                              className="form-control  text-light py-3"
                              placeholder="E-mail"
                              value={user.email}
                              disabled
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="labels mb-3 mt-3">ID</label>
                            <input
                              style={{ background: "none" }}
                              type="text"
                              className="form-control  text-light py-3"
                              placeholder="ID"
                              value={user.reference}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                <i className="bi bi-x-octagon me-2"></i>Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
