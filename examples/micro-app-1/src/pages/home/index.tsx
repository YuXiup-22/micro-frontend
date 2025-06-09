import { Link } from "react-router";
export default function Home() {
  return (
    <div>
      <h2>Home</h2>
      <br></br>
      <Link to="/micro-app-1/test">子应用micro-app-1内部跳转：test</Link>
    </div>
  );
}
