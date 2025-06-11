import type { RouteObject } from "react-router";

const router: RouteObject[] = [
  {
    path: "/micro-app-2/home",
    lazy: () =>
      import("./index").then((item) => ({
        Component: item.default,
      })),
  },
];
export default router;
