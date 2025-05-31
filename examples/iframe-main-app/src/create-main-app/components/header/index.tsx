import { bus } from "@micro-frontend/micro-iframe";
export default function Header() {
  const containerBus = bus("container");
  function tabItemClick(path: string) {
    /**
     * history.pushState({}, "", path)无效，react-router监听不到变化
     * 需要在主应用中，通过react-router改变路由
     */
    containerBus.event.emit("navItemClick", { path });
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      <h1>main-app自定义框架Header</h1>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => tabItemClick("/main-app-home")}
      >
        main-app-home
      </div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => tabItemClick("/main-app-test")}
      >
        main-app-test
      </div>
    </div>
  );
}
