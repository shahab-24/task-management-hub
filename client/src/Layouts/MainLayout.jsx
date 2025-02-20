import { Outlet } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";


const MainLayout = () => {
        return (
                <div>
                <div className="mb-10"><Navbar></Navbar></div>

                <main className="my-20 border-red-400 border-2 min-h-[calc(100vh-64px)"><Outlet></Outlet></main>
                
                <div className="mt-20"><Footer></Footer></div>
                

                        
                </div>
        );
};

export default MainLayout;