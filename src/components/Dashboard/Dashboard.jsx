import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  theme,
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Switch,
  ConfigProvider,
  Dropdown,
  Space,
  Drawer,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  DownOutlined,
  CalendarOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentDate] = useState(new Date());

  // Control de responsive
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menú para el dropdown
  const dropdownItems = {
    items: [
      {
        key: "1",
        label: "Perfil",
        icon: <UserOutlined />,
      },
      {
        key: "2",
        label: "Configuración",
        icon: <SettingOutlined />,
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: "Cerrar Sesión",
        icon: <DownOutlined />,
      },
    ],
  };

  // Menú lateral
  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <BarChartOutlined />,
      label: "Análisis",
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: "Usuarios",
    },
    {
      key: "4",
      icon: <AppstoreOutlined />,
      label: "Proyectos",
    },
    {
      key: "5",
      icon: <CheckSquareOutlined />,
      label: "Tareas",
    },
    {
      key: "6",
      icon: <CalendarOutlined />,
      label: "Calendario",
    },
    {
      key: "7",
      icon: <SettingOutlined />,
      label: "Configuración",
    },
  ];

  // Obtener el día, mes y año actuales
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("es-ES", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}>
      <Layout style={{ minHeight: "100vh" }}>
        {!mobileView ? (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme={isDarkMode ? "dark" : "light"}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
              zIndex: 2,
            }}
            width={240}>
            <div
              className="logo"
              style={{
                height: 64,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "16px 0",
                background: "transparent",
              }}>
              {collapsed ? (
                <Avatar
                  size={48}
                  style={{
                    backgroundColor: "#1890ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}>
                  A
                </Avatar>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Avatar
                    size={64}
                    style={{
                      backgroundColor: "#1890ff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "28px",
                      fontWeight: "bold",
                      marginBottom: 8,
                    }}>
                    A
                  </Avatar>
                  <Title
                    level={4}
                    style={{ margin: 0, color: isDarkMode ? "#fff" : "#000" }}>
                    Admin Panel
                  </Title>
                </div>
              )}
            </div>
            <Menu
              theme={isDarkMode ? "dark" : "light"}
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={menuItems}
              style={{ borderRight: 0 }}
            />
            {!collapsed && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  borderTop: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                }}>
                <Switch
                  checkedChildren="🌙"
                  unCheckedChildren="☀️"
                  checked={isDarkMode}
                  onChange={setIsDarkMode}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </Sider>
        ) : (
          <Drawer
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            bodyStyle={{ padding: 0 }}
            width={240}
            title="Admin Panel"
            headerStyle={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "16px 0",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Avatar
                size={64}
                style={{
                  backgroundColor: "#1890ff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}>
                A
              </Avatar>
              <Title level={5} style={{ margin: "8px 0 16px 0" }}>
                Admin Panel
              </Title>
            </div>
            <Menu
              theme={isDarkMode ? "dark" : "light"}
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={menuItems}
              style={{ borderRight: 0 }}
            />
            <div
              style={{ padding: "16px", textAlign: "center", marginTop: 16 }}>
              <Switch
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                checked={isDarkMode}
                onChange={setIsDarkMode}
                style={{ width: "100%" }}
              />
            </div>
          </Drawer>
        )}
        <Layout
          style={{
            marginLeft: mobileView ? 0 : collapsed ? 80 : 240,
            transition: "all 0.2s",
            background: isDarkMode ? "#141414" : "#f0f2f5",
          }}>
          <Header
            style={{
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              background: isDarkMode ? "#1f1f1f" : "#fff",
              boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="text"
                icon={
                  mobileView ? (
                    <MenuUnfoldOutlined />
                  ) : collapsed ? (
                    <MenuUnfoldOutlined />
                  ) : (
                    <MenuFoldOutlined />
                  )
                }
                onClick={() =>
                  mobileView ? setDrawerVisible(true) : setCollapsed(!collapsed)
                }
                style={{ fontSize: "16px", width: 64, height: 64 }}
              />
              {!mobileView && (
                <Title level={4} style={{ margin: 0, marginLeft: 16 }}>
                  Dashboard
                </Title>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Space size="middle">
                {!mobileView && (
                  <Text strong>{`${day} de ${month}, ${year}`}</Text>
                )}
                {mobileView && (
                  <Switch
                    checkedChildren="🌙"
                    unCheckedChildren="☀️"
                    checked={isDarkMode}
                    onChange={setIsDarkMode}
                    size="small"
                  />
                )}
                <Dropdown menu={dropdownItems}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar
                        src="https://xsgames.co/randomusers/avatar.php?g=male&id=8"
                        style={{ border: "2px solid #1890ff" }}
                      />
                      {!mobileView && <Text strong>Admin</Text>}
                      <DownOutlined style={{ fontSize: 12 }} />
                    </Space>
                  </a>
                </Dropdown>
              </Space>
            </div>
          </Header>

          <Content
            style={{
              margin: "16px",
              borderRadius: "8px",
              minHeight: 280,
            }}>
            {/* Header con bienvenida */}
            <Card
              style={{
                marginBottom: 16,
                background: isDarkMode
                  ? "linear-gradient(90deg, #1f1f1f 0%, #141414 100%)"
                  : "linear-gradient(90deg, #1890ff 0%, #096dd9 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                  <Title
                    level={mobileView ? 4 : 3}
                    style={{
                      margin: 0,
                      color: "#fff",
                      marginBottom: 8,
                    }}>
                    Bienvenido al Panel de Administración
                  </Title>
                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      marginBottom: 0,
                    }}>
                    Aquí encontrarás el resumen de actividades y estadísticas
                    importantes del sistema.
                  </Paragraph>
                </Col>
              </Row>
            </Card>
          </Content>

          <Footer style={{ textAlign: "center", background: "transparent" }}>
            <Text type="secondary">
              Admin Dashboard ©{new Date().getFullYear()} - U Caldas
            </Text>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Dashboard;
