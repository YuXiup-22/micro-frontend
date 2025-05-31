import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div>
      main--framework
      <br></br>
      <div>
        主应用内部路由
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
