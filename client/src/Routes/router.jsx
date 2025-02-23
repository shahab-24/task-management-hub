import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Components/Shared/Login";
import ErrorPage from "../Components/ErrorPage";


export const router = createBrowserRouter([
        {
          path: "/",
          element: <MainLayout></MainLayout>,
          errorElement: <ErrorPage></ErrorPage>,
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