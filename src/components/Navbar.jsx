import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)


  return (
    <div className="Navbar">
      <span className="logo">Chattie</span>
      <div className="user">
        <img
          src={currentUser.photoURL}
        />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
