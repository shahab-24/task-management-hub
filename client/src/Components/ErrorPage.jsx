import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../Components/Button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl max-w-md w-full"
      >
        <div className="flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-red-500" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">
            Oops!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md">
              Return Home
            </Button>
          </Link>
          <Link to="/login">
            <Button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md">
              Login
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
