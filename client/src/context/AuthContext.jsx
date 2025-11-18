import { createContext, useState, useEffect } from "react";

// {
//     "error": "Please authenticate using a valid token"
// }

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const getUser = async () => {
        const res = await fetch(`${VITE_API_URL}/api/auth/getuser`, {
          headers: {
            "auth-token": `${localStorage.getItem("token")}`,
          },
          method: "POST",
        });
        const data = await res.json();
        console.log(data);
        if (data.error) {
          localStorage.removeItem("token");
          setToken(null);
          return;
        }
        setToken(localStorage.getItem("token"));
      };
      getUser();
    }
  }, []);


  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
