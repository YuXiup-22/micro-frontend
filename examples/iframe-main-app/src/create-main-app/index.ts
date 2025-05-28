/**
 * 1.创建微前端基础框架结构，暴露主应用需要挂载的节点
 */
import { createMainApp as createFrameMainApp } from "@micro-frontend/micro-iframe";
export function createMainApp() {
  const { mountDom } = createFrameMainApp();
  return { mountDom };
}
