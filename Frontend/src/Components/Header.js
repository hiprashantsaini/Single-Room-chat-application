import React, { useState } from 'react';
import './header.css';

const Header = () => {
    const [open,setOpen]=useState(false);
    const [openHome,setOpenHome]=useState(false);
    return (
        <div className='headed-container'>
            <div className='logo-con'>
                <span>LOGO</span>
            </div>
            <div className={open ? 'nav active':'nav'}>
                <span className='close-icon' onClick={()=>setOpen(false)}>✖️</span>
                <ul>
                    <li onClick={()=>setOpenHome(!openHome)}>Home</li>
                    <ul className={openHome ? 'sidebar-internal active-it' :'sidebar-internal'}>
                        <li>Course</li>
                        <li>Jobs</li>
                    </ul>
                    <li className='about-nav'>About
                    <ul>
                        <li>Education</li>
                        <li>Address</li>
                        <li style={{paddingBottom:"15px"}}>My Work</li>
                    </ul>
                    </li>
                    <li>Contact</li>
                    <li>More</li>
                    <li>Explore</li>
                </ul>
            </div>
            {/* <div className='actions'>
                <h2>Login</h2>
                <h2>Signin</h2>
            </div> */}
            <div className='open-side-icon'>
                <span onClick={()=>setOpen(!open)}>≣</span>
            </div>
        </div>
    )
}

export default Header;