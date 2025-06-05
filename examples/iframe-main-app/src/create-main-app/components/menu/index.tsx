import { bus } from "@micro-frontend/micro-iframe";
export default function Menu() {
  const containerBus = bus("container");
  function tabItemClick(path: string) {
    containerBus.event.emit("menuItemClick", { path });
  }
  return (
    <div>
      <h1>main-app自定义框架Menu</h1>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => tabItemClick("/micro-app-1/home")}
      >
        micro-app-1/home
      </div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => tabItemClick("/micro-app-2/test")}
      >
        micro-app-2/test
      </div>
    </div>
  );
}
