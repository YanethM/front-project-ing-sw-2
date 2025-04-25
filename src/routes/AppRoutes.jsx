import Dashboard from "../components/Dashboard/Dashboard";
import Login from "../components/Auth/Login";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

export const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/admin" element={<Dashboard />}></Route>
      ) : (
        <Route path="/" element={<Login />}></Route>
      )}
    </Routes>
  );
};
