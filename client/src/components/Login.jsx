import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Brain, Loader2 } from "lucide-react";
const Login = () => {
  const { token,setToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(()=>{
    if(token){
      navigate("/dashboard");
      return;
    }
  },[token])

  const VITE_API_URL= import.meta.env.VITE_API_URL || "";
  
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "email") {
      value = value.toLowerCase();
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        setIsLoading(false);
        return;
      }
      if (response.ok) {
        console.log("Data submitted successfully!");
        setToken(data.authToken);
        localStorage.clear();
        localStorage.setItem("token", data.authToken);
        navigate("/dashboard");
      } else {
        alert("Server Error. Refresh the page and try again");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-5">
              <Brain className="h-14 w-14 text-teal-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
            <p className="mt-1 text-sm text-gray-500">
              Access your SolveIQ account
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                placeholder="yourname@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                placeholder="••••••••"
              />
            </div>

            <div>
            {isLoading ? (
                <button
                  disabled
                  type="button"
                  className="w-full py-2 px-4 rounded-md cursor-pointer text-white font-medium bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center justify-center"
                >
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </button>
              ) : (
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md text-white font-medium bg-teal-600 cursor-pointer hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Sign in
              </button>
            )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
