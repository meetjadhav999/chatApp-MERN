import React, { useState } from 'react'
import '../css/signup.css'
import {useNavigate} from 'react-router-dom'
import { useCookies } from 'react-cookie'
function Signup() {

  const navigate = useNavigate()
  const [cookie,setCookie] = useCookies(['token'])
  const [email,setEmail] = useState('')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')

  const [error,setError]= useState('')
  const showError = () =>{
    if (error !== ''){
      return <p className="error">{error}</p>
    }
  }
  const handleSignin = () => {
    fetch('http://127.0.0.1:3001/api/users/register',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        username,
        password,
        email

      })
    }).then(async(response)=>{

      const data = await response.json()
      if(response.status === 201){
        setCookie('token',data,{ path: "/" })
        navigate('/')
      }
      else setError(data.error)
  
    })
    
  }
  return (
    <div className='background-blue'>
    <div className='form-container'>
      <h1>Sign Up</h1>
      {showError()}
      <div className='form'>
        <input type='text' id='username' placeholder='Username' onChange={(e)=>{setUsername(e.target.value)}}></input>
        <input type='email' id='email' placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}}></input>
        <input type='password' id='password' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}></input>
        <button className='form-btn' onClick={handleSignin}>Sign In</button>
        <p>Already have an account, <a href='/login'>Login</a></p>

      </div>
    </div>
    </div>
  )
}

export default Signup
