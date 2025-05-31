import { useNavigate } from "react-router";
export default function Test() {
  const navigate = useNavigate();
  return (
    <div>
      Test
      <br></br>
      <button onClick={() => navigate("/main-app-home")}>
        主应用内部跳转TO:Home
      </button>
    </div>
  );
}
