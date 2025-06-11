import { createRoot } from "react-dom/client";
import "./index.css";
import { CreateMicroApp } from "@micro-frontend/micro-iframe";
import { Router } from "./router";
CreateMicroApp().then((item) => {
  createRoot(item.mountDom!).render(<Router />);
});
