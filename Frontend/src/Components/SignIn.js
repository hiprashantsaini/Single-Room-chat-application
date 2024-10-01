import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetLoggedInUser from '../hooks/useGetLoggedInUser';
import "./styles/signin.css";

const SignIn = () => {
    const {user}=useGetLoggedInUser();
    const navigate=useNavigate();
    const [signinInput, setSigninInput] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [login, setLogin] = useState(true);
    const handleInput = (e) => {
        setSigninInput({ ...signinInput, [e.target.name]: e.target.value });
    }

    const handleForm = async (e) => {
        e.preventDefault();
        let url=''
        if(login){
            url='login'
        }else{
            url='signup'
        }
        try {
            const res=await axios.post(`http://localhost:8000/user/api/${url}`,signinInput,{
                headers:{
                    "Content-Type":"application/json",
                },
                withCredentials:true
            });
            if(res.data.success){
                alert(res.data.message);
                if( url==='login'){
                    navigate('/');
                    console.log("res :",res);
                }else if (url==='signup'){
                    setLogin(true);
                }
            }
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message);
        }finally{
            setSigninInput({
                username: '',
                email: '',
                password: ''
            })
        }
    }

    useEffect(()=>{
        if(user){
            navigate('/');
        }
    })
    return (
        <div className='main-container'>
            <div className='form-container'>
                <form onSubmit={handleForm}>
                    {
                        !login && (
                            <input type='text' value={signinInput.username} placeholder='Your name' name='username' onChange={handleInput} required/>
                        )
                    }
                    <input type='email' value={signinInput.email} placeholder='Your email' name='email' onChange={handleInput} required/>
                    <input type='password' value={signinInput.password} placeholder='Your password' onChange={handleInput} name='password' required/>
                    <button type='submit'>{login ? 'Login' : 'SignIn'}</button>
                </form>
                <div style={{marginTop:"10px",width:"100%",boxSizing:"border-box"}}>
                    {
                        login ? (
                            <p onClick={()=>setLogin(false)} className='login-btn'>Don't have an account?</p>
                        ):(
                            <p onClick={()=>setLogin(true)} className='login-btn' style={{width:"100%",padding:"5px 2px",color:"red",textAlign:"center",cursor:"pointer"}}>Already have an account?</p>
                        )
                    }
                   
                </div>
            </div>
        </div>
    )
}

export default SignIn