/**
 * 1.创建微前端基础框架结构，暴露主应用需要挂载的节点
 */
import { CreateMainApp as CreateFrameMainApp } from "@micro-frontend/micro-iframe";
import Header from "./components/header";
import Menu from "./components/menu";
import Tab from "./components/tab";
export async function createMainApp() {
  const { mountDom } = await CreateFrameMainApp({
    customBaseCom: {
      header: Header,
      menu: Menu,
      tab: Tab,
    },
    iframeContainer: "#root",
    microApps: [
      {
        name: "app1",
        origin: "http://localhost:5174",
        activeRule: "/micro-app-1/*",
      },
      {
        name: "app2",
        origin: "http://localhost:5175",
        activeRule: "/micro-app-2/*",
      },
    ],
  });
  return { mountDom };
}
