/**
 * 1.创建微前端基础框架结构，暴露主应用需要挂载的节点
 */
import { CreateMainApp as CreateFrameMainApp } from "@micro-frontend/micro-iframe";
export async function createMainApp() {
  const { mountDom, headerDom, menuDom, tabDom } = await CreateFrameMainApp();
  return { mountDom };
}
