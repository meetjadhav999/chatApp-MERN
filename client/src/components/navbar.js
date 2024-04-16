import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/navbar.css'
function Navbar({userdata,token}) {
  const navigate = useNavigate() 

  const [userProfile, setUserProfile] = useState('')

  const [isSearchFocused,setIsSearchFocused] = useState(false)


  const logout = () => {
    fetch('http://127.0.0.1:3001/api/users/logout',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    }).then(response => {
      if(response.status === 200){
        navigate('/login')
      }
      else{
        console.log("something went wrong")
      }
    })
  }

  

  const searchUser = (e) =>{
    fetch('http://127.0.0.1:3001/api/users/search-user/'+e.target.value,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    }).then(async response => {
      const data = await response.json()
      if(response.status === 200){
        setUserProfile(data)
      }
      else{
        setUserProfile('')
      }
    })
  }

  const searchResult = () =>{
    if(isSearchFocused){
      if(userProfile !== ''){
        return(
          <div className='searchcontainer'>
            <div className='search-user-profile'>
              <img src={'http://127.0.0.1:3001/api/users/profile-picture/'+userProfile._id}></img>
              <h4>{userProfile.username}</h4>
            </div>
          </div>
        )
      }
      else{

        return(
          <div className='searchcontainer'>
            <p>Search for username</p>
          </div>
        )
      }
    }
  }

  return (
    <div className='navbar'>
        <div className='logo'>{userdata.username}</div>
        <div className='nav-links'>
          
            <a href=''>Profile</a>
            <button onClick={logout}>Log out</button>
        </div>
      
    </div>
  )
}

export default Navbar
