import { AppRoutes as RoutesComponent } from "./routes/AppRoutes";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
     <BrowserRouter>
        <RoutesComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
