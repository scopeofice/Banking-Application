import React, { useState } from 'react'
import axios from 'axios'
import '../Styles/RegistrationPage.css'
import { useNavigate, Link } from 'react-router-dom'
export default function Registration() {

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        phoneNumber: '',
        password: '',
        accountType: '',
    })


    const handleChange = (e) => {
        setUser({...user,[e.target.name] : e.target.value});
    }
    const nav = useNavigate();

    const handleSubmit = async (e) =>{
        try {
            const response = await axios.post("http://localhost:8080/api/user",user)
            console.log("Registration sucessful!", response.data);
            nav("/login")
        } catch (error) {
            console.log("registration failed", error.message);
        }
    }

  return (

<div className='home'>
    <div className='registrationpage'>
       <header>
        <h1>Registration</h1>
        <p>Please provide your details</p>
      </header>
      <form onSubmit={handleSubmit} className='form'>
        
        <label>
            First Name : <input type="text" name="firstName" value={user.firstName} onChange={handleChange} />
        </label>
        <label>
            Last Name : <input type="text" name="lastName" value={user.lastName} onChange={handleChange} />
        </label>
        <label>
            Email : <input type="text" name="email" value={user.email} onChange={handleChange} />
        </label>
        <label>
            Password : <input type="password" name="password" value={user.password} onChange={handleChange} />
        </label>
        <label>
            Address : <input type="text" name="address" value={user.address} onChange={handleChange} />
        </label>
        <label>
            Phone : <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} />
        </label>
        <label>
            Account Type : <select name="accountType" value={user.accountType} onChange={handleChange}>
                <option value="">Select Account Type</option>
                <option value="savings">Savings</option>
                <option value="recurring">Recurring</option>
                <option value="current">Current</option>
            </select>
        </label>

        <button className='btn' style={{border:"2px solid green"}} type='submit'>Register</button>
        <Link className='link' to={"/login"}>Already a user? Login.</Link>

      </form>
    </div>
    </div>
  )
}
