import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import App from "../App";
import { Navigate } from "react-router";
const globRouter = Object.values(
  import.meta.glob<RouteObject[]>("../pages/**/route.ts", {
    import: "default",
    eager: true,
  })
).flat();

const route = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate to="/micro-app-2/home"></Navigate>,
      },
      ...globRouter,
      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={route}></RouterProvider>;
};
