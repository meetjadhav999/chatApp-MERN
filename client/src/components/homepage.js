import React, { useEffect, useRef, useState } from 'react'
import Navbar from './navbar'
import ConversationComp from './conversations'
import Message from './message'
import '../css/homepage.css'
import '../css/messenger.css'
import {io} from 'socket.io-client'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

function Homepage() {
  const navigate = useNavigate() 

  const [cookies] = useCookies(['token'])
  const [searchedUser, setSearchedUser] = useState(undefined)
  const [userdata,setUserdata] = useState([])
  const [conversations,setConversation] = useState([])
  const [currentChat,setCurrentChat] = useState(null)
  const currentchatRef = useRef()
  const [messages,setMessages] = useState([])
  const [newMessage,setNewMessage] = useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scroll =useRef()
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socket = useRef()



  useEffect(() => {
    socket.current = io("ws://127.0.0.1:8900")
    
  },[]);
  useEffect(()=>{
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  })
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if(userdata._id){
      console.log(userdata._id)
      socket.current.emit("addUser", userdata._id);
    }
  }, [userdata]);


  useEffect(()=>{
    const getUser = () => {
      fetch('http://127.0.0.1:3001/api/users/me',{
        method:"GET",
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${cookies.token}`
        }
      }).then(async response=>{
        const data = await response.json()
        if(response.status == 200 ){
          setUserdata(data)
        }
        else{
          navigate('/signup')
        }
      })
    }
    getUser()
  },[])
  useEffect(()=>{
    console.log('runn')
    const getConversation = () => {
      fetch("http://localhost:3001/api/conversation",{
        method:"GET",
        headers:{
          "Authorization":`Bearer ${cookies.token}`,
          "Content-Type":"application/json",
        }
      }).then(async response => {
        const data = await response.json()
        if(response.status === 200){
          setConversation(data)

        }
      })
    }
    getConversation()

  },[messages])

  useEffect(()=>{
    const getMessages = () =>{
      if(currentChat?.status === 'new'){
        return
      }
      fetch('http://localhost:3001/api/message/'+currentChat?._id,{
        method:"GET",
        headers:{
          "Authorization":`Bearer ${cookies.token}`,
          "Content-Type":"application/json",
        }
      }).then(async response => {
        const data = await response.json()
        if(response.status === 200){
          setMessages(data)
        }
      }).catch(e=>console.log(e))
    }
    getMessages()
  },[currentChat])


  const handleSendBtn = async (e) => {
    e.preventDefault()
    if(currentChat?.status === 'new'){
      fetch("http://localhost:3001/api/conversation",{
        method:"POST",
        headers:{
          "Authorization":`Bearer ${cookies.token}`,
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          receiverID:currentChat.receiverID
        })
      }).then(async response => {
        const data = await response.json()
        if(response.status === 200){
          setCurrentChat(data)
          currentchatRef.current = data
          console.log('first this')
          handleNewMessage()
        }
        else{
          console.log(response)
        }
        })
    }else{
      handleNewMessage()
    }
  }

  const handleNewMessage = async () => {
    console.log('ok2')
    const currentchat = currentChat?.status!=="new" ? currentChat : currentchatRef.current
    console.log(currentchat)  
    const receiverId = await currentchat.members.find(
        (member) =>{ 
          console.log('then this')
          return member !== userdata._id
        }
      );

    

    socket.current.emit("sendMessage", {
      senderId: userdata._id,
      receiverId,
      text: newMessage,
    });

    fetch("http://localhost:3001/api/message",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${cookies.token}`,
          "Content-Type":"application/json",
      },
      body:JSON.stringify({
        sender:userdata._id.toString(),
        conversation:currentchat._id.toString(),
        text:newMessage
      })
    }).then(async response => {
      const data = await response.json()
      if(response.status === 200){
        setMessages([...messages,data])
        setNewMessage('')
      }

    })
  } 

  useEffect(()=>{
    scroll.current?.scrollIntoView()
  },[messages])


  const searchUser = (e) =>{
    fetch('http://127.0.0.1:3001/api/users/search-user/'+e.target.value,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${cookies.token}`
      }
    }).then(async response => {
      const data = await response.json()
      if(response.status === 200){
        setSearchedUser(data)
      }
      else{
        setSearchedUser(undefined)
      }
    })
  }
  const isNewConversation = (user) =>{
    const conv = conversations.find((c)=>{
      return c.members[1] === user._id
    })
    if(conv){
      return setCurrentChat(conv)
    }
    else{
      setMessages([])
      setCurrentChat({status:'new',receiverID:user._id})
    }
    
  }
  return (
    <div className='homepage'>
      <Navbar userdata={userdata} token={cookies.token}></Navbar>
      <div className='chat-wrapper'>
        <div className='user-container'>
          <div className='searchholder'>
              <input type="text" placeholder='search' onChange={searchUser} id='searchInput'></input>

          </div>
          
          {
            searchedUser ?
            <>
             {searchedUser.map((user)=>(
              
            <div key={user._id} onClick={()=>isNewConversation(user)}>
              <div className="user">
                <div className="userinfo-wrapper">
                    <img src={"http://127.0.0.1:3001/api/users/profile-picture/"+user._id}></img>
                    <div className="user-info">
                        <h3>{user.username}</h3>

                    </div>
                </div>
            </div>
            </div>
          ))}
            </>:<>
            {conversations.map((c)=>(
            <div key={c._id} onClick={()=>setCurrentChat(c)}>
              <ConversationComp  userdata={userdata} conversation={c} token={cookies.token}></ConversationComp>
            </div>
          ))}
            </>
          } 
        </div>
        <div className='messenger'>
            {
                currentChat ?
            <>
            <div className='message-container'>
              {messages.map((m)=>(
                <div ref={scroll} key={m._id}>
                  <Message message={m} own={m.sender === userdata._id.toString()}></Message>
                </div>
              ))}

            </div>
            <div className='message-box'>
                <textarea className='message-input' onChange={(e)=>setNewMessage(e.target.value)} value={newMessage} placeholder='Type your message here...'></textarea>
                <button className='send-btn' onClick={handleSendBtn}>Send</button>
            </div></>:<h2 className='open-con-text'>Open any conversation</h2>
            }
        </div>
      </div>
      
    </div>
  )
}

export default Homepage
