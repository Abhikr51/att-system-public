import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { register } from '../../store/actions/AuthActions';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const create_user = (event) => {
    event.preventDefault();
    setLoading(true)
    dispatch(register(name,email,password, () => {
      setLoading(false)
    }, (err) => {
      setLoading(false)
      alert(err.response.data.msg)
    }))
  }
  return (
    <React.Fragment>
      <form autoComplete='off' onSubmit={create_user} >
        <div >
          <input required type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter Your name" />
        </div>
        <div >
          <input required type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter Your email" />
        </div>
        <div >
          <input required type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter Your Password" />
        </div>
        <div >
          <button >{loading ? "Registing user..." : 'Register'}</button>
        </div>
      </form>
    </React.Fragment >
  )
}

export default Register