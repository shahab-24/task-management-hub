import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return children;
}
