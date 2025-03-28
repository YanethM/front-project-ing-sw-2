import { Card, Spin, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const { Title } = Typography;

export const Login = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  console.log(`Is authenticated: ${isAuthenticated}`);

  return (
    <Card style={{ maxWidth: 400, margin: "0 auto", marginTop: 50 }}>
      <Spin spinning={loading}>
        <Title level={2} style={{ textAlign: "center" }}>
          LogIn
        </Title>
      </Spin>
    </Card>
  );
};

// export default Login;
