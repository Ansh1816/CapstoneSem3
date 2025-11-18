import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import React, { useState, useContext, useEffect } from "react";

const Dashboard = () => {
  const { token,setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Dashboard</h1>
      <button className='btn btn-primary' onClick={()=>{
        localStorage.clear()
        setToken(null)
        navigate('/login')
      }}>Logout</button>
    </div>
  )
}

export default Dashboard
