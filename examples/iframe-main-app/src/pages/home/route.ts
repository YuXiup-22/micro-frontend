import type { RouteObject } from "react-router";
const route: RouteObject[] = [
  {
    path: "/main-app-home",
    lazy: () =>
      import("./index").then((module) => ({
        Component: module.default,
      })),
  },
];
export default route;
