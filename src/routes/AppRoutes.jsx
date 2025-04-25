import Dashboard from "../components/Dashboard/Dashboard";
import Login from "../components/Auth/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);  
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // Verificar si hay token en localStorage antes de mostrar rutas
    const hasToken = localStorage.getItem("token") !== null;
    
    // Esto nos da una idea inicial mientras se inicializa Redux
    console.log("Token in localStorage:", hasToken);
    console.log("isAuthenticated in Redux:", isAuthenticated);
    
    setChecking(false);
  }, [isAuthenticated]);
  
  if (checking) {
    return <div>Verificando autenticación...</div>;
  }
  
  const hasLocalToken = localStorage.getItem("token") !== null;
  const effectiveAuth = isAuthenticated !== undefined ? isAuthenticated : hasLocalToken;
  
  console.log("Effective auth state:", effectiveAuth);
  
  return (
    <Routes>
      <Route path="/" element={
        effectiveAuth ? <Navigate to="/admin" /> : <Login />
      } />
      
      <Route path="/admin" element={
        effectiveAuth ? <Dashboard /> : <Navigate to="/" />
      } />
      
      <Route path="/admin/*" element={
        effectiveAuth ? <Dashboard /> : <Navigate to="/" />
      } />
      
      {/* Para cualquier otra ruta */}
      <Route path="*" element={
        <Navigate to={effectiveAuth ? "/admin" : "/"} />
      } />
    </Routes>
  );
};

export default AppRoutes;