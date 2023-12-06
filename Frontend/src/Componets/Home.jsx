import React from 'react'
import '../Styles/HomePage.css'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const nav = useNavigate();
    const handleClick=()=>{
        nav("/registration")
    }
  return (
    <div className='home'>
    <div className='homepage'>
      <header>
        <h1>Welcome to MyBank</h1>
        <p>Your Trusted Banking Partner</p>
      </header>

      <section className="features">
        <div className="feature">
          <h2>Online Banking</h2>
          <p>Access your accounts 24/7 with our secure online banking system.</p>
        </div>

        <div className="feature">
          <h2>Mobile App</h2>
          <p>Manage your finances on the go with our mobile banking app.</p>
        </div>

        <div className="feature">
          <h2>Financial Planning</h2>
          <p>Get expert advice on financial planning and investment strategies.</p>
        </div>
      </section>
      <section className="cta">
        <h2>Open an Account Today</h2>
        <p>Join thousands of satisfied customers who trust us with their banking needs.</p>
        <button style={{backgroundColor:"blue"}}onClick={handleClick}>Open an Account</button>
      
      </section>

    </div>
    </div>
  )
}
