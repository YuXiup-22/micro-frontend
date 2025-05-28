import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createMainApp } from "./create-main-app";
/**
 * 1.创建react主应用和微前端基础架构，主应用挂载到框架中对应的dom中，
 *
 */
const mainAppContainer = createMainApp();
createRoot(mainAppContainer!).render(<App />);
