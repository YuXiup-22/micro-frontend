import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <h2>Test</h2>
      <br></br>
      <Link to="/micro-app-1/home">子应用micro-app-1内部跳转：Home</Link>
    </div>
  );
}
