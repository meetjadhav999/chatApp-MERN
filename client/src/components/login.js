import React,{useState} from 'react'
import { useCookies } from 'react-cookie'
import '../css/signup.css'
function Login() {
  const [user,setUser] = useState('')
  const [password,setPassword] = useState('')
  const [cookies, setCookie] = useCookies(['token']);
  const [error,setError]= useState('')
  const showError = () =>{
    if (error !== ''){
      return <p className="error">{error}</p>
    }
  }

  const handleuserinput = (e) =>{
    setUser(e.target.value)
  }
  const handlePassword = (e) =>{
    setPassword(e.target.value)
  }
  const handlelogin = () => {
    fetch('http://localhost:3001/api/users/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        user:user,
        password:password
      })
    }).then(async(response)=>{
      const data = await response.json()
      if(response.status === 200){
        setCookie('token',data,{ path: "/" })
        window.location = '/'
      }
      else setError(data.error)
    })
  }
  return (
    <div className='background-blue'>
    <div className='form-container'>
      <h1>Log In</h1>
      {showError()}
      <div className='form'>
        <input type='text' onChange={handleuserinput} placeholder='Username or email'></input>
        <input type='password' onChange={handlePassword} placeholder='Password'></input>
        <button className='form-btn' onClick={handlelogin}>Log In</button>
        <p>I am a new user, <a href='/signup'>Sign Up</a></p>

      </div>
    </div>
    </div>
  )
}

export default Login
