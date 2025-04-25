import { AppRoutes as RoutesComponent } from "./routes/AppRoutes";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAutheticated, setUser } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(setAutheticated(true));
      }
    };
    checkAuthState();
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <RoutesComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
