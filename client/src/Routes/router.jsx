import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Components/Shared/Login";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
        {
          path: "/",
          element: <MainLayout></MainLayout>,
          errorElement: <h3>Error page</h3>,
          children: [
                {
                        path: '/',
                        element: 
                                <Home></Home>
                
                },
                {
                        path: '/login',
                        element: <Login></Login>
                }
          ]
        },
      ]);