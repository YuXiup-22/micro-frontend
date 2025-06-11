import { useNavigate } from "react-router";
export default function Test() {
  const navigate = useNavigate();
  return (
    <div>
      <h3>Test</h3>
      <div
        onClick={() => {
          navigate("/micro-app-2/home");
        }}
      >
        跳转去Home
      </div>
    </div>
  );
}
