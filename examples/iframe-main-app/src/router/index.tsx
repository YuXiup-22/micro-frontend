import type { RouteObject } from "react-router";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import App from "../App.tsx";
import { Suspense } from "react";
import { bus } from "@micro-frontend/micro-iframe";
const routes: any[] = Object.values(
  import.meta.glob("../pages/**/route.ts", {
    //关闭懒加载，直接同步导入所有匹配模块
    eager: true,
    //只获取模块的默认导出（如果模块是 export default）
    import: "default",
  })
).flat();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        index: true,
        element: <Navigate to="/main-app-home"></Navigate>,
      },
      ...routes,
    ],
  },
]);
const containerBus = bus("container");
export const Router = () => {
  containerBus.event.on("navItemClick", (e) => {
    router.navigate(e.path);
  });
  containerBus.event.on("menuItemClick", (e) => {
    router.navigate(e.path);
  });
  return (
    <Suspense fallback={<div>loading....</div>}>
      <RouterProvider router={router}></RouterProvider>
    </Suspense>
  );
};
