import type { MicroAppItem } from "../bus/container/type";
import { bus } from "../bus";
import mitt from "mitt";
import { type microAppDataItem } from "../bus/mainApp";
/**
 * 管理所有子应用的状态
 * 注册/挂载/卸载/激活/失活/销毁/加载/错误
 */
enum LifyCycleKey {
  "REGISTERED",
  "LOADING",
  "MOUNTED",
  "UNMOUNTED",
  "ACTIVATED",
  "DEACTIVATED",
  "DESTROY",
  "ERROR",
}
type LifyCycleKeyType = keyof typeof LifyCycleKey;
const LifyCycle: { [key in LifyCycleKeyType]: key } = {
  ACTIVATED: "ACTIVATED",
  DEACTIVATED: "DEACTIVATED",
  DESTROY: "DESTROY",
  ERROR: "ERROR",
  LOADING: "LOADING",
  MOUNTED: "MOUNTED",
  REGISTERED: "REGISTERED",
  UNMOUNTED: "UNMOUNTED",
};
interface iframeInfo {
  id: string;
  config: MicroAppItem;
  status: LifyCycleKeyType;
  element: HTMLIFrameElement | null;
}
export const CreateIframeManager = () => {
  const iframes = new Map<string, iframeInfo>();
  const containerBus = bus("container");
  // 为什么opt是可选呢，情况：只是注册-需要path;失活，则不需要
  const loadIfram = async (id: string, opt?: any) => {
    // 目前不需要验证是否ref有效，这里肯定有效
    const mountDom = containerBus.data.get(["iframeMountDom"]).iframeMountDom;
    const iframeInfo = iframes.get(id);
    if (!iframeInfo) return;
    // 避免重复加载
    if (iframeInfo.status === "LOADING") return;

    {
      // TODO: 先隐藏其他的micro-app,同时需要考虑跳转路由和当前路由相同的情况
      Array.from(iframes)
        .map(([id, iframeInfo]) => iframeInfo)
        .filter((item) => item.id !== id)
        .map((item) => hideIframe(item.id));
    }
    {
      // TODO: deactived状态的，改为actived,直接显示后return
      if (
        iframeInfo.element &&
        getComputedStyle(iframeInfo.element).display !== "block"
      ) {
        iframeInfo.element.style.display = "block";
        iframeInfo.status = "ACTIVATED";
        return;
      }
    }
    iframeInfo.status = "LOADING";
    const iframe = document.createElement("iframe");

    let src = iframeInfo.config.origin;
    if (opt?.path) src += opt.path;
    iframe.src = src;
    iframe.setAttribute("id", id);
    iframe.setAttribute("frameBorder", "0");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.display = "block";
    iframe.name = JSON.stringify({
      appInfo: iframeInfo.config,
      parentData: {
        origin: window.origin,
        layoutData: containerBus.data.get(
          containerBus.expose.getLayoutDataKeys()
        ),
      },
    });
    mountDom?.appendChild(iframe);
    const [error, e] = await new Promise<[Error | null, Event | null]>(
      (resolve) => {
        iframe.onload = (e) => {
          resolve([null, e]);
        };
        iframe.onerror = () =>
          resolve([new Error(`${id} iframe load failed`), null]);
      }
    );
    if (error) {
      iframeInfo.status = "ERROR";
      return;
    }
    console.log(error, e, "error---------------e");
    // 初次加载，状态为mounted
    iframeInfo.status = "MOUNTED";
    iframeInfo.element = iframe;
    const currentTargetIfram = e?.target as HTMLIFrameElement;
    event.emit("MOUNTED", {
      ...iframeInfo.config,
      contentWindow: currentTargetIfram.contentWindow,
    });
  };
  const hideIframe = (iframeId?: string) => {
    // 获取当前激活子应用
    const iframeItem = Array.from(iframes).find(([id, iframeInfo]) => {
      if (iframeId) return id === iframeId;
      if (!iframeInfo.element) return;
      return getComputedStyle(iframeInfo.element).display === "block";
    });
    if (!iframeItem) return;
    const [id, iframeInfo] = iframeItem;
    if (!iframeInfo.element) return;
    iframeInfo.element.style.display = "none";
    iframeInfo.status = "DEACTIVATED";
  };
  const event = mitt<{
    [key in LifyCycleKeyType]: microAppDataItem;
  }>();
  return {
    registerIframe: (id: string, config: MicroAppItem) => {
      const iframeInfo = {
        id,
        config,
        status: LifyCycle.REGISTERED,
        element: null, //挂载的iframeDom
      };
      iframes.set(id, iframeInfo);
    },
    checkIframeStatus: (
      id: string,
      status: LifyCycleKeyType | LifyCycleKeyType[]
    ) => {
      if (Array.isArray(status))
        return status.includes(iframes.get(id)!.status);
      return iframes.get(id)?.status === status;
    },
    loadIfram,
    hideIframe,
    iframeEvent: event,
  };
};
