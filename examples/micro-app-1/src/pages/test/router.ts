import type { RouteObject } from "react-router";
const routes: RouteObject[] = [
  {
    path: "/micro-app-1/test",
    lazy: () =>
      import("./index").then((item) => ({
        Component: item.default,
      })),
  },
];
export default routes;
