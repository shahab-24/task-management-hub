import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // Importing Framer Motion

const Login = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useContext(AuthContext);
//   console.log(user);

  const handleGoogleLogin = async () => {
        const loggedInUser = await signInWithGoogle(); // ✅ Wait for user update
        // console.log("🔄 Logged in user:", loggedInUser);
      
        if (loggedInUser) {
          Swal.fire("Welcome!", `Logged in as ${loggedInUser.displayName}`, "success");
          navigate("/"); // ✅ Redirect to home page
        } else {
          Swal.fire("Error", "Failed to log in!", "error");
        }
      };
      

  return (
    <div className="h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Add an animated heading */}
        <motion.h2
          className="text-3xl font-semibold mb-6 text-blue-600"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to  
          <span to="/" className="ml-2 text-lg md:text-2xl font-semibold md:font-bold tracking-wide">
            Task<span className="text-pink-700 text-xl md:font-bold md:text-3xl">Hub</span>
          </span>
        </motion.h2>

        <p className="text-gray-600 mb-6">Sign in with Google to continue</p>

        <motion.button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
