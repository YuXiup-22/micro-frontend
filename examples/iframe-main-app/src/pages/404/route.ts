import { type RouteObject } from "react-router";
const route: RouteObject[] = [
  {
    path: "*",
    lazy: () =>
      import("./index").then((item) => ({
        Component: item.default,
      })),
  },
];
export default route;
