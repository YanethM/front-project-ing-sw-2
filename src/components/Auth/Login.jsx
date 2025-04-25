import { Typography } from "antd";
import { UserOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/auth";
import { setAutheticated, setLoading } from "../../redux/authSlice";
import "./Login.css";

const { Title } = Typography;

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    current_password: "",
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  
  // Verificar si el user esta autenticado y redireccionar
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validación de email
    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Validación de password
    if (!formData.current_password) {
      newErrors.current_password = "Password is required!";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(setLoading(true));
    try {
      const response = await auth.signIn(formData);
      console.log(response);
      
      if (response.token) {
        dispatch(setAutheticated(true));
      } else {
        setLoginError(response.message || "Login failed");
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password");
      dispatch(setLoading(false));
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Title level={2} className="login-title">Welcome Back</Title>
          <p className="login-subtitle">Please sign in to continue</p>
        </div>
        
        {loginError && (
          <div className="error-message">
            <ExclamationCircleOutlined className="error-icon-antd" />
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <UserOutlined className="input-icon-antd" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "input-error" : ""}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="current_password">Password</label>
            <div className="input-container">
              <LockOutlined className="input-icon-antd" />
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.current_password ? "input-error" : ""}
              />
            </div>
            {errors.current_password && (
              <span className="error-text">{errors.current_password}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-text">
                <span className="loading-spinner"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;