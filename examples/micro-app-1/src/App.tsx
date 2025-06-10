import { Outlet } from "react-router";
function App() {
  return (
    <div style={{ background: "#ffffff" }}>
      <h1>micro-app-1</h1>
      <br></br>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
