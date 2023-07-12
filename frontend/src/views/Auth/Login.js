import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import AppInput from '../../components/AppInput';
import { setLogin } from '../../store/actions/AuthActions';
import Loader from "../../components/Loader"
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const loginUser = (event) => {
    setLoading(true)
    event.preventDefault();
    dispatch(setLogin(email, password, () => {
      setLoading(false)
    }, (err) => {
      setLoading(false)
      alert(err.response.data.msg)
    }))
  }
  return (
    <div className='bg-primary wrapper d-flex justify-content-center align-items-center' >
      
      <form autoComplete='off' className='login-box' onSubmit={loginUser} >
        <div className="heading text-primary">Login</div>
        <label htmlFor="email">Email or Username </label>
        <AppInput 
          field_name= 'Email' type= 'text' placeholder= 'eg . exampleuser.mail.com'
          onChange={(e) => setEmail(e.target.value)} 
          value={email}
          onBlur={(e) => { console.log(e) }} 
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <AppInput 
          field_name= 'Password' type= 'password' placeholder= 'eg . mypassword#123'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          onBlur={(e) => { console.log(e) }} 
          required
        />
        <br />
        <button style={{width : 100 ,height : 100 , borderRadius : 50 ,alignSelf : 'end'}} className='btn btn-secondary ' type='submit' > {loading ? <Loader className="text-white" /> : 'Go'}</button>

      </form>
    </div >
  )
}
