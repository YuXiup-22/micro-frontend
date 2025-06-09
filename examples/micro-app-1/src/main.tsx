import { createRoot } from "react-dom/client";
import { Router } from "./router";
import { CreateMicroApp } from "@micro-frontend/micro-iframe";
import "./index.css";
CreateMicroApp().then((item) => {
  createRoot(item.mountDom!).render(<Router />);
});
