import React, { useState } from 'react'
import "./App.css"
import ChatRoom from './Components/ChatRoom'
import Sidebar from './Components/Sidebar'
import useGetLoggedInUser from './hooks/useGetLoggedInUser'

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const {user} = useGetLoggedInUser();

  if (!user) {
    return <></>
  }
  return (
    <div className='App'>
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <ChatRoom showSidebar={showSidebar} setShowSidebar={setShowSidebar} user={user} />
    </div>
  )
}

export default App

