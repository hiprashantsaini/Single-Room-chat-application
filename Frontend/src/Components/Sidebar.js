import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const [liveUsers, setLiveUsers] = useState([]);
  const getLiveUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/allLive", { withCredentials: true });
    if (res.data.success) {
      console.log("all Live :", res.data);
      setLiveUsers(res.data?.values);
    }
  }
  useEffect(() => {
    getLiveUsers();
  },[]);
  return (
    <div className={`sidebar-container ${showSidebar ? 'active' : ''}`}>
      <div className='sidebar-head'>
        <p>All Live Members</p>
      </div>
      <div className='sidebar-users'>
        {
          liveUsers && liveUsers.map((user) => {
            return (
              <div key={user?._id} className='sidebar-user'>
                <div className='logo-icon'>{user?.username?.slice(0,2).toUpperCase()}</div>
                <p>{user?.username}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Sidebar