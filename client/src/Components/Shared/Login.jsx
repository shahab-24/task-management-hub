import { signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import loginImage from "../assets/login-bg.jpg"; // Add a nice background image

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      Swal.fire("Welcome!", `Logged in as ${user.displayName}`, "success");
      navigate("/"); // Redirect to the main page
    } else {
      Swal.fire("Error", "Failed to log in!", "error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center">
        {/* <img src={loginImage} alt="Login" className="w-full h-40 object-cover rounded-md mb-6" /> */}
        <h2 className="text-2xl font-semibold mb-4">Welcome to Task Manager</h2>
        <p className="text-gray-600 mb-4">Sign in with Google to continue</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
