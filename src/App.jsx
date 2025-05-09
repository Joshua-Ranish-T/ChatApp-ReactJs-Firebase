import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./Style.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const {currentUser} = useContext(AuthContext);
  const ProtectedRoute = ({children})=>{
    if(!currentUser)
    {
      return <Navigate to="/login"/>
    }
    return children;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
