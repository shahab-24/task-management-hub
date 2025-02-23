import { createContext, useState, useEffect } from "react";
import axiosInstance from "../Api/Api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Auto-login using cookies when page reloads
  useEffect(() => {
        axiosInstance
          .get("/user", { withCredentials: true }) // ✅ Auto-fetch user from backend
          .then((res) => setUser(res.data.user))
          .catch(() => setUser(null)); // If no token, set user to null
      }, []);
      
  const login = async (email, password) => {
    try {
      await axiosInstance.post("/jwt", { email }); // ✅ Token set in cookies
      const response = await axiosInstance.get("/user"); // ✅ Fetch user details
      setUser(response.data.user);
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  const signInWithGoogle = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (!result.user) throw new Error("Google sign-in failed");
      
          await axiosInstance.post("/jwt", { email: result.user.email }); // ✅ Store JWT in cookies
      
          // ✅ Fetch latest user details from backend after login
          const response = await axiosInstance.get("/user");
          setUser(response.data.user);
      
          return response.data.user; // ✅ Return user details after fetching
        } catch (error) {
          console.error("Google Sign-In Error:", error);
          return null;
        }
      };
      

  const logOut = async () => {
    await axiosInstance.post("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
