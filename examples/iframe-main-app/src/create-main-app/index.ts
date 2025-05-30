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
    iframeContainer: "dd",
  });
  return { mountDom };
}
