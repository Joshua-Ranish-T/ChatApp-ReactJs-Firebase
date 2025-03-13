import React from 'react'
import Navbar from "../components/Navbar";
import Search from '../components/Search';
import Chats from '../components/Chats'
const Sidebar = () => {
  return (
    <div className='Sidebar'><Navbar/><Search/><Chats/></div>
  )
}

export default Sidebar