import axios from 'axios';
import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Styles/Login.css'

export default function Login() {

    const nav = useNavigate();
    
    const [credientials, setCredientials] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) =>{
        setCredientials({
            ...credientials,
            [e.target.name]: e.target.value, 
        });
    };
    const handleSubmit = async (e) => {
        try {
            const resp = await axios.post("http://localhost:8080/api/user/login",credientials);
            
            sessionStorage.setItem("user",JSON.stringify(resp.data));
            
            nav("/user");
            window.location.reload();
            
            console.log("Login sucessful!");
        } catch (error) {
            alert("f")
            console.log("Login failed", error.message);
        }
    }
  return (
    <div className='home'>
    <div className='login'>
        <header>
        <h1>Login</h1>
        <p>Please provide your credentials</p>
      </header>
      <form className='form'>
      <label>
            Email : <input type="text" name="email" value={credientials.email} onChange={handleChange} />
        </label>
        <label>
            Password : <input type="password" name="password" value={credientials.password} onChange={handleChange} />
        </label>
        <button className='btn' style={{border:"2px solid green"}} type='button' onClick={handleSubmit}>Login</button>
        <Link className='link' to={"/registration"}>Register new user.</Link>
      </form>
    </div>
    </div>
  )
}
