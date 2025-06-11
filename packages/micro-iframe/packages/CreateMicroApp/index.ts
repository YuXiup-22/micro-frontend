import type { MicroAppInitData } from "../bus/container/type";
import { CreateContainer } from "../CreateContainer/index";
import { type ContainerDomRefs } from "../CreateContainer/Container";
import { bus } from "../bus";
export const CreateMicroApp = async (
  props?: MicroAppInitData
): Promise<ContainerDomRefs> => {
  if (!props) props = {};

  const mountRes = await CreateContainer({ type: "microApp", ...props });
  autoSyncRouter();

  return mountRes;
};
const autoSyncRouter = () => {
  const microAppBus = bus("microApp");

  microAppBus.cros.on("syncRouter", (e) => {
    const { appInfo, parentRouter, replacePath } = e.data;
    if (!appInfo) return;
    const { hash, pathname, search } = new URL(window.location.href);
    let currentPath = pathname + search;
    if (appInfo.router.mode === "hash") currentPath = hash.replace("#", "");
    if (currentPath === replacePath) return;

    const autoSyncRouter = appInfo.router.sync ?? true;
    if (!autoSyncRouter) return;
    replaceRouter(replacePath);
  });
  const replaceRouter = (path: string) => {};
};
