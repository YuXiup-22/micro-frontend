import { Outlet } from "react-router";

function App() {
  return (
    <div style={{ background: "#fff" }}>
      <h1>micro-app-2</h1>
      <br></br>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
