import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import logo from '../../assets/task hub.png' 

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status once on load (Fixes redirect issue)
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Toggle Dark Mode & Save to LocalStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const navLinks = (
    <>
      <li><NavLink to="/" className="hover:text-primary transition">Home</NavLink></li>
     
    </>
  );

  if (isLoading) {
    return null; // Prevents flashing effect on refresh
  }

  return (
    <div className="transition-all duration-300">
      <nav className="navbar p-4 shadow-lg flex justify-between items-center transition-all duration-300 fixed top-0 left-0 w-full z-50 
        bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white">
        
        {/* Left Section - Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-md text-white">
            {menuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
          </button>
          

          {/* Logo */}
          <NavLink  to="/" className="text-lg flex items-center gap-1 md:text-2xl font-semibold md:font-bold tracking-wide">
          <img className="w-10 h-10 rounded-xl hidden md:flex" src={logo} alt=""></img>
            Task<span className="text-pink-700 text-xl md:font-bold md:text-3xl">Hub</span>
          </NavLink>
        </div>

        {/* Center Section - Desktop Menu */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-4 space-x-4">{navLinks}</ul>
        </div>

        {/* Right Section - Dark Mode & Auth Buttons */}
        <div className="flex items-center gap-2 mg:gap-4">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full bg-gray-700 dark:bg-gray-200 text-white dark:text-black flex items-center justify-center"
          >
            {darkMode ? <FaSun size={10} /> : <FaMoon size={10} />}
          </button>

          {/* Auth Section */}
          {user ? (
            <button 
              onClick={handleLogout} 
              className="btn btn-sm md:btn-outline bg-red-600 hover:bg-red-700 text-white transition duration-300 px-4 py-2"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login">
              <button className="btn btn-sm md:btn-outline bg-green-600 hover:bg-green-700 text-white transition duration-300 px-4 py-2">
                Login
              </button>
            </NavLink>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMenuOpen(false)}></div>
      )}

      <div className={`fixed top-0 left-0 h-[80%] w-36 bg-white dark:bg-gray-800 shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:hidden z-50`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-black dark:text-white">
          <FaTimes size={24} />
        </button>
        <ul className="menu p-6 mt-4">{navLinks}</ul>
      </div>

    </div>
  );
};

export default Navbar;
