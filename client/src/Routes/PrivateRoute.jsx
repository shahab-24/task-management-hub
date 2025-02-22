import { Navigate } from "react-router-dom";


import Loader from "../Components/Shared/Loader";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";


const PrivateRoute = ({children}) => {
        
        const { user, loading } = useContext(AuthContext);
        
        if(loading)return <Loader></Loader>
        // if(user) return children;


  return user ? children : <Navigate to="/login" />;
}

        


export default PrivateRoute;