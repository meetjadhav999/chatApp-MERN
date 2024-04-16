import React, { useEffect, useState } from "react";

export default function ConversationComp({
    userdata,
    conversation,
    token,
}) {
    const [user,setUser] = useState([])
    useEffect(() => {
        const friendID = conversation.members.find((m) => m !== userdata._id);
        const getUser = () => {
            fetch('http://127.0.0.1:3001/api/users/'+friendID,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json' 
                }
            }).then(async response => {
                const data = await response.json()
                if(response.status === 200){
                    setUser(data)
                }
            })
        }
        getUser()
    },[]);

    return (
        <div>
            <div className="user">
                <div className="userinfo-wrapper">
                    <img src={"http://127.0.0.1:3001/api/users/profile-picture/"+user._id}></img>
                    <div className="user-info">
                        <h3>{user.username}</h3>
                        <p>
                        {conversation.lastmessage.text}
                    </p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
