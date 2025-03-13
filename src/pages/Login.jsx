import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';  // Import toast and ToastContainer once
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
      toast.success("Logging In Successfully!");
    
      
      setTimeout(() => {
        navigate("/");
      }, 2500);  
    } catch (error) {
      console.error("Login error: ", error);
      toast.error("An error occurred during login");
    }
    
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <h1 className="logo">User Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />  {/* Changed type from 'gmail' to 'email' */}
          <input type="password" placeholder="Password" />
          <button>Login</button>
          {err && <span style={{ color: "red" }}>{err}</span>}
        </form>
        <p className="ppp">Don't have an account? 
          <Link to="/register" style={{color:"whitesmoke", fontWeight:"700"}}>
            Register
          </Link> 
        </p>
      </div>
      <ToastContainer />  {/* Make sure ToastContainer is included */}
    </div>
  );
};

export default Login;
