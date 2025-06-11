import { NavLink } from "react-router";

export default function Home() {
  return (
    <div>
      <h3>Home</h3>
      <NavLink to="/micro-app-2/test">跳转去test</NavLink>
    </div>
  );
}
