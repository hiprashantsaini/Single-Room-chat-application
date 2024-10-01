import React, { useEffect, useMemo, useRef, useState } from 'react';

import io from 'socket.io-client';
import useGetAllMessages from '../hooks/useGetAllMessages';

const ChatRoom = ({ showSidebar, setShowSidebar, user }) => {
  const [text, setText] = useState('');
  let n = 0;
  const socket = useMemo(() => {
    console.log(++n);
    return (
      io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      })
    )
  }, []);



  const scrollEnd = useRef();

  const [messages, setMessages] = useGetAllMessages();

  const handleSend = () => {
    if (text === '') {
      alert('Please Enter some message');
      return;
    }
    console.log("User in handleSend :", user);
    socket.emit('newMessage', text);
    setText('');
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {  // Check if Enter key is pressed
      handleSend();
    }
  };

  const handleAutoScrollEnd = () => {
    scrollEnd?.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(()=>{
    handleAutoScrollEnd();
  },[messages]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (data) => {
        setMessages((prev) => [...prev, data]);
      };
      console.log("how much")
      socket.on('oneNewMessage', handleNewMessage);

      return () => {
        if(socket){
          socket.off('oneNewMessage', handleNewMessage);
        }
      };
    }
  }, [socket]);


  return (
    <div className='chat-container'>
      <div className='chat-head'>
        <p>Let's discuss or talks together</p>
        <span className='show-sidebar-icon' onClick={() => setShowSidebar(!showSidebar)}>≣</span>
      </div>
      <div className='chat-messages'>
        {
          messages && messages.map((message) => {
            return (
            <div key={message?._id} className='chat-message' style={user?._id === message?.author?._id ? {justifyContent:"left"}:{justifyContent:"right"}}>
              <div className='logo-owner' style={user?._id === message?.author?._id ? {}:{backgroundColor:"rgb(223 254 202)"}}>
                <div className='message-owner'>
                  <div className='logo-icon' style={{fontSize:"14px"}}>{user?._id === message?.author?._id ? 'YOU':message?.author?.username?.slice(0,2).toUpperCase()}</div>
                  <p>{message?.author?.username?.split(" ")[0]?.toLowerCase()}</p>
                </div>
                <p>{message?.msg}</p>
              </div>
            </div>
            )
          })
        }

        <h2 ref={scrollEnd}></h2>
      </div>
      <div className='send-message'>
        <input value={text} type='text' onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} required placeholder='Enter message...' />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default ChatRoom

