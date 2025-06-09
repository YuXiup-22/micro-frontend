import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router";
import App from "../App";
import { Suspense } from "react";

const globelRouter = Object.values(
  import.meta.glob<RouteObject[]>("../pages/**/router.ts", {
    eager: true,
    import: "default",
  })
).flat();
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate to="/micro-app-1/home"></Navigate>,
      },
      ...globelRouter,
    ],
  },
]);
export const Router = () => {
  return (
    <Suspense fallback={<div>micro-app-1 loading....</div>}>
      <RouterProvider router={router}></RouterProvider>
    </Suspense>
  );
};
