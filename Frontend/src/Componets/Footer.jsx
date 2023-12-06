import React from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Footer.css'

export default function Footer() {
  return (
    <footer className='footer'>
       <span>2023 &copy; All Rights Reserved.</span>
        <div className=''>Build With<span className='heart'>&#9825;</span>by&nbsp;
        <Link to="/" >Shubham Ghodkhande</Link>
        </div>
        <Link to="https://github.com/scopeofice" target='_blank' className='hello'>Say hello</Link>
    </footer>
  )
}
