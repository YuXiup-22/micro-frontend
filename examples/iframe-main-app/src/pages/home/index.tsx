import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      Home
      <br></br>
      <Link to="/main-app-test">主应用内部跳转：test</Link>
    </div>
  );
}
