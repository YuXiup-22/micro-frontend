import type { RouteObject } from "react-router";

export default [
  {
    path: "/main-app-test",
    lazy: () =>
      import("./index").then((module) => ({
        Component: module.default,
      })),
  },
] as RouteObject[];
