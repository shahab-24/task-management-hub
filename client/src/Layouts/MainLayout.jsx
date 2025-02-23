import { Outlet } from "react-router-dom";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";


const MainLayout = () => {
        return (
                <div>
                <div className="mb-10"><Navbar></Navbar></div>

                <main className="my-20 border-green-400 border-1 min-h-[calc(100vh-64px)"><Outlet></Outlet></main>
                
                <div className="mt-10"><Footer></Footer></div>
                

                        
                </div>
        );
};

export default MainLayout;