import { Typography, Tabs, Form, Input, Button, message, Modal } from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  ExclamationCircleOutlined, 
  MailOutlined,
  UserAddOutlined,
  KeyOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/auth";
import { setAutheticated, setLoading } from "../../redux/authSlice";
import "./Login.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Login = () => {
  // Estado para manejar las pestañas (login, registro, olvidé contraseña)
  const [activeTab, setActiveTab] = useState("1");
  
  // Estado para formulario de login
  const [formData, setFormData] = useState({
    email: "",
    current_password: "",
  });
  
  // Estado para formulario de registro
  const [registerData, setRegisterData] = useState({
    fullname: "",
    email: "",
    current_password: "",
    confirm_password: ""
  });

  // Estado para el formulario de código de verificación
  const [verificationData, setVerificationData] = useState({
    email: "",
    code: ""
  });
  
  // Estado para mostrar modal de verificación
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  // Estado para olvidé mi contraseña
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(null);
  
  // Verificar si el user está autenticado y redireccionar
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);
  
  const validateLoginForm = () => {
    const newErrors = {};
    
    // Validación de email
    if (!formData.email) {
      newErrors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }
    
    // Validación de password
    if (!formData.current_password) {
      newErrors.current_password = "Contraseña es requerida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    // Validación de nombre completo
    if (!registerData.fullname) {
      newErrors.fullname = "Nombre completo es requerido";
    }
    
    // Validación de email
    if (!registerData.email) {
      newErrors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = "Formato de email inválido";
    }
    
    // Validación de password
    if (!registerData.current_password) {
      newErrors.current_password = "Contraseña es requerida";
    } else if (registerData.current_password.length < 6) {
      newErrors.current_password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    // Validación de confirmación de password
    if (!registerData.confirm_password) {
      newErrors.confirm_password = "Confirmar contraseña es requerido";
    } else if (registerData.current_password !== registerData.confirm_password) {
      newErrors.confirm_password = "Las contraseñas no coinciden";
    }
    
    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateForgotPasswordForm = () => {
    if (!forgotPasswordEmail) {
      message.error("Por favor ingresa tu correo electrónico");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      message.error("Formato de email inválido");
      return false;
    }
    return true;
  };
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };
  
  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationData({ ...verificationData, [name]: value });
  };
  
  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!validateLoginForm()) {
      return;
    }
    
    dispatch(setLoading(true));
    try {
      const response = await auth.signIn(formData);
      
      if (response.token) {
        dispatch(setAutheticated(true));
      } else {
        setLoginError(response.message || "Login failed");
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Email o contraseña inválidos");
      dispatch(setLoading(false));
    }
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterSuccess(null);
    
    if (!validateRegisterForm()) {
      return;
    }
    
    // Eliminar el campo de confirmación de password antes de enviar
    const dataToSend = {
      fullname: registerData.fullname,
      email: registerData.email,
      current_password: registerData.current_password
    };
    
    try {
      dispatch(setLoading(true));
      const response = await auth.signUp(dataToSend);
      
      if (response && response.userId) {
        setRegisterSuccess("Registro exitoso. Por favor verifica tu correo electrónico.");
        // Establecer datos para la verificación
        setVerificationData({
          email: registerData.email,
          code: ""
        });
        setShowVerificationModal(true);
      } else {
        message.error(response.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Register error:", error);
      message.error(error.response?.data?.message || "Error en el registro");
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  const handleVerificationSubmit = async () => {
    if (!verificationData.code) {
      message.error("Por favor ingresa el código de verificación");
      return;
    }
    
    try {
      dispatch(setLoading(true));
      const response = await auth.verifyCode(verificationData);
      
      if (response && response.token) {
        message.success("Verificación exitosa");
        setShowVerificationModal(false);
        dispatch(setAutheticated(true));
      } else {
        message.error(response.message || "Código inválido");
      }
    } catch (error) {
      console.error("Verification error:", error);
      message.error(error.response?.data?.message || "Error en la verificación");
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  const handleResendCode = async () => {
    if (!verificationData.email) {
      message.error("Email no disponible para reenviar código");
      return;
    }
    
    try {
      dispatch(setLoading(true));
      const response = await auth.resendVerificationCode({ email: verificationData.email });
      
      if (response && response.message) {
        message.success("Código reenviado exitosamente");
      } else {
        message.error("Error al reenviar el código");
      }
    } catch (error) {
      console.error("Resend code error:", error);
      message.error(error.response?.data?.message || "Error al reenviar el código");
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordSuccess(null);
    
    if (!validateForgotPasswordForm()) {
      return;
    }
    
    // Aquí normalmente enviarías una solicitud para recuperar la contraseña
    // Como es un ejemplo, solo mostramos un mensaje de éxito
    try {
      dispatch(setLoading(true));
      // Simular una solicitud de API (reemplazar con tu API real)
      setTimeout(() => {
        setForgotPasswordSuccess("Se ha enviado un enlace de recuperación a tu correo electrónico.");
        dispatch(setLoading(false));
      }, 1500);
    } catch (error) {
      console.error("Forgot password error:", error);
      message.error("Error al procesar la solicitud");
      dispatch(setLoading(false));
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Limpiar los errores y mensajes al cambiar de pestaña
    setErrors({});
    setRegisterErrors({});
    setLoginError(null);
    setRegisterSuccess(null);
    setForgotPasswordSuccess(null);
  };
  
  return (
    <div className="login-page">
      <div className="login-card">
        <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
          <TabPane 
            tab={
              <span>
                <UserOutlined />
                Iniciar Sesión
              </span>
            } 
            key="1"
          >
            <div className="login-header">
              <Title level={2} className="login-title">Bienvenido de nuevo</Title>
              <p className="login-subtitle">Por favor inicia sesión para continuar</p>
            </div>
            
            {loginError && (
              <div className="error-message">
                <ExclamationCircleOutlined className="error-icon-antd" />
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-container">
                  <UserOutlined className="input-icon-antd" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleLoginChange}
                    placeholder="Ingresa tu email"
                    className={errors.email ? "input-error" : ""}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="current_password">Contraseña</label>
                <div className="input-container">
                  <LockOutlined className="input-icon-antd" />
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleLoginChange}
                    placeholder="Ingresa tu contraseña"
                    className={errors.current_password ? "input-error" : ""}
                  />
                </div>
                {errors.current_password && (
                  <span className="error-text">{errors.current_password}</span>
                )}
              </div>
              
              <div className="form-link-container">
                <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab("3")}}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              
              <button 
                type="submit" 
                className="login-button" 
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="loading-spinner"></span>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
              
              <div className="form-footer">
                <p>
                  ¿No tienes una cuenta?{" "}
                  <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab("2")}}>Regístrate</a>
                </p>
              </div>
            </form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <UserAddOutlined />
                Registrarse
              </span>
            } 
            key="2"
          >
            <div className="login-header">
              <Title level={2} className="login-title">Crear cuenta</Title>
              <p className="login-subtitle">Regístrate para acceder al sistema</p>
            </div>
            
            {registerSuccess && (
              <div className="success-message">
                {registerSuccess}
              </div>
            )}
            
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="fullname">Nombre completo</label>
                <div className="input-container">
                  <UserOutlined className="input-icon-antd" />
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={registerData.fullname}
                    onChange={handleRegisterChange}
                    placeholder="Ingresa tu nombre completo"
                    className={registerErrors.fullname ? "input-error" : ""}
                  />
                </div>
                {registerErrors.fullname && <span className="error-text">{registerErrors.fullname}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <div className="input-container">
                  <MailOutlined className="input-icon-antd" />
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Ingresa tu email"
                    className={registerErrors.email ? "input-error" : ""}
                  />
                </div>
                {registerErrors.email && <span className="error-text">{registerErrors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="register-password">Contraseña</label>
                <div className="input-container">
                  <LockOutlined className="input-icon-antd" />
                  <input
                    type="password"
                    id="register-password"
                    name="current_password"
                    value={registerData.current_password}
                    onChange={handleRegisterChange}
                    placeholder="Ingresa tu contraseña"
                    className={registerErrors.current_password ? "input-error" : ""}
                  />
                </div>
                {registerErrors.current_password && (
                  <span className="error-text">{registerErrors.current_password}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm-password">Confirmar contraseña</label>
                <div className="input-container">
                  <LockOutlined className="input-icon-antd" />
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm_password"
                    value={registerData.confirm_password}
                    onChange={handleRegisterChange}
                    placeholder="Confirma tu contraseña"
                    className={registerErrors.confirm_password ? "input-error" : ""}
                  />
                </div>
                {registerErrors.confirm_password && (
                  <span className="error-text">{registerErrors.confirm_password}</span>
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
                    Registrando...
                  </span>
                ) : (
                  "Registrarse"
                )}
              </button>
              
              <div className="form-footer">
                <p>
                  ¿Ya tienes una cuenta?{" "}
                  <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab("1")}}>Inicia sesión</a>
                </p>
              </div>
            </form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                Recuperar Contraseña
              </span>
            } 
            key="3"
          >
            <div className="login-header">
              <Title level={2} className="login-title">Recuperar contraseña</Title>
              <p className="login-subtitle">Ingresa tu email para recibir un enlace de recuperación</p>
            </div>
            
            {forgotPasswordSuccess && (
              <div className="success-message">
                {forgotPasswordSuccess}
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="login-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Email</label>
                <div className="input-container">
                  <MailOutlined className="input-icon-antd" />
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotPasswordEmail}
                    onChange={handleForgotPasswordChange}
                    placeholder="Ingresa tu email"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="login-button" 
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="loading-spinner"></span>
                    Enviando...
                  </span>
                ) : (
                  "Enviar enlace de recuperación"
                )}
              </button>
              
              <div className="form-footer">
                <p>
                  <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab("1")}}>Volver a iniciar sesión</a>
                </p>
              </div>
            </form>
          </TabPane>
        </Tabs>
      </div>

      {/* Modal para verificación de código */}
      <Modal
        title="Verificación de cuenta"
        visible={showVerificationModal}
        onCancel={() => setShowVerificationModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowVerificationModal(false)}>
            Cancelar
          </Button>,
          <Button key="resend" onClick={handleResendCode}>
            Reenviar código
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleVerificationSubmit}>
            Verificar
          </Button>,
        ]}
      >
        <div className="verification-modal-content">
          <p>
            Hemos enviado un código de verificación a tu correo electrónico.
            Por favor, ingresa el código para completar tu registro.
          </p>
          <Form layout="vertical">
            <Form.Item label="Email">
              <Input 
                prefix={<MailOutlined />} 
                name="email"
                value={verificationData.email} 
                onChange={handleVerificationChange} 
                disabled 
              />
            </Form.Item>
            <Form.Item label="Código de verificación">
              <Input 
                prefix={<KeyOutlined />} 
                name="code"
                value={verificationData.code} 
                onChange={handleVerificationChange} 
                placeholder="Ingresa el código de 6 dígitos" 
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Login;