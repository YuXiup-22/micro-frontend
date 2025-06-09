import type { RouteObject } from "react-router";
import Home from "./index";
const routes: RouteObject[] = [
  {
    path: "/micro-app-1/home",
    lazy: () =>
      import("./index").then((item) => ({
        Component: item.default,
      })),
  },
];
export default routes;
