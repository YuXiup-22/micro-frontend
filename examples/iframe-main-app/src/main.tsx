import { createRoot } from "react-dom/client";
import "./index.css";
import { createMainApp } from "./create-main-app";
import { Router } from "./router";

/**
 * 1.创建react主应用和微前端基础架构，主应用挂载到框架中对应的dom中，
 *
 */
createMainApp().then((res) => {
  createRoot(res.mountDom!).render(<Router></Router>);
});
//
