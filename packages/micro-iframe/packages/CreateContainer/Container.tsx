import React, {
  useEffect,
  useRef,
  useMemo,
  type CSSProperties,
  useState,
  useCallback,
} from "react";
import styles from "./index.module.scss";
import { bus } from "../bus";
import type { MainAppInitData, InitContainerData } from "../bus/container/type";
export type ContainerDomRefs = {
  headerDom: HTMLDivElement | null;
  menuDom: HTMLDivElement | null;
  tabDom: HTMLDivElement | null;
  mountDom: HTMLDivElement | null;
  microAppContainer: Element | null;
};
interface ContainerLayoutProps {
  onRefsReady?: (refs: ContainerDomRefs) => void;
  customBaseCom?: MainAppInitData["customBaseCom"];
  type?: InitContainerData["type"];
}
type layoutDom = "nav" | "menu" | "tab" | "mount";
type layoutDomRefs = {
  [k in layoutDom]: React.RefObject<HTMLElement | null>;
};
/** containerData实时获取最新的数据，并且重写执行函数组件 */
function useContainerData() {
  const containerBus = bus("container");
  const [data, setData] = useState(containerBus.data.get());

  useEffect(() => {
    const cancel = containerBus.data.watch({
      cb: (newData) => setData(newData),
      watchKeys: ["microApps", "activeMicroAppName"],
    });
    return cancel;
  }, []);
  return {
    data,
    update: containerBus.data.set,
  };
}

export default function ContainerLayout({
  onRefsReady,
  customBaseCom,
  type,
}: ContainerLayoutProps) {
  const {
    header: CustomHeader,
    menu: CustomMenu,
    tab: CustomTab,
  } = customBaseCom || {};
  const teleportDomRefs = useRef<ContainerDomRefs>({
    headerDom: null,
    menuDom: null,
    tabDom: null,
    mountDom: null,
    microAppContainer: null,
  });
  const isMainApp = useMemo<boolean>(() => type === "mainApp", [type]);
  const isMicroApp = useMemo<boolean>(() => type === "microApp", [type]);
  const { data: containerData, update } = useContainerData();
  console.log(containerData, "containerData---------");
  const microAppsContainerStyleComputed = useMemo<CSSProperties>(() => {
    const resStyle: CSSProperties = {
      display:
        containerData.microApps?.length && containerData.activeMicroAppName
          ? "block"
          : "none",
      position: "absolute",
      zIndex: 1,
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
    };
    return resStyle;
  }, [containerData.activeMicroAppName, containerData.microApps.length]);
  const layoutDomRefs: layoutDomRefs = {
    nav: React.createRef(),
    menu: React.createRef(),
    tab: React.createRef(),
    mount: React.createRef(),
  };
  const layoutDomObserve = new Map<layoutDom, MutationObserver>();
  useEffect(() => {
    if (onRefsReady && teleportDomRefs.current) {
      onRefsReady(teleportDomRefs.current);
    }
  }, [onRefsReady, teleportDomRefs]);
  useEffect(() => {
    return () => {
      layoutDomObserve.forEach((value, key) => {
        value.disconnect();
        layoutDomObserve.delete(key);
      });
    };
  }, []);
  const createLayoutDomObserve = useCallback(
    (e: HTMLElement | null, type: layoutDom) => {
      if (!e || layoutDomRefs[type].current) return;
      layoutDomRefs[type].current = e;
      const handleChange = () => {
        const { x, y, width, height } = e.getBoundingClientRect() || {};
        update({ [`${type}Rect`]: { x, y, width, height } });
      };
      handleChange();
      const observer = new MutationObserver(handleChange);
      observer.observe(e, {
        childList: true,
        subtree: true,
      });
      layoutDomObserve.set(type, observer);
    },
    []
  );
  return (
    <div className={styles["iframe-base"]}>
      <header ref={(e) => createLayoutDomObserve(e, "nav")}>
        {isMainApp && <div>{CustomHeader ? <CustomHeader /> : "header"}</div>}
        {isMicroApp && (
          <div
            style={{
              pointerEvents: "none",
              height: containerData.navRect.height,
            }}
          ></div>
        )}
      </header>
      <section className={styles["iframe-base-content"]}>
        <aside
          ref={(e) => createLayoutDomObserve(e, "menu")}
          className={styles["aside-content"]}
        >
          {isMainApp && (
            <div
              ref={(el) => {
                teleportDomRefs.current.menuDom = el;
              }}
            >
              {CustomMenu ? <CustomMenu /> : "aside"}
            </div>
          )}
          {isMicroApp && (
            <div
              style={{
                pointerEvents: "none",
                width: containerData.menuRect.width,
              }}
            ></div>
          )}
        </aside>
        <main className={styles["main-content"]}>
          <header ref={(e) => createLayoutDomObserve(e, "tab")}>
            {isMainApp && (
              <div
                ref={(el) => {
                  teleportDomRefs.current.tabDom = el;
                }}
              >
                {CustomTab ? <CustomTab /> : "tab"}
              </div>
            )}
            {isMicroApp && (
              <div
                style={{
                  pointerEvents: "none",
                  height: containerData.tabRect.height,
                }}
              ></div>
            )}
          </header>
          <section
            ref={(e) => createLayoutDomObserve(e, "mount")}
            className={styles["main-section"]}
          >
            <div
              ref={(el) => {
                teleportDomRefs.current.mountDom = el;
              }}
              className={styles["main-section-content"]}
            >
              mian/micro-app
            </div>
          </section>
        </main>
      </section>
      {type === "mainApp" && (
        <div
          ref={(el) => {
            teleportDomRefs.current.microAppContainer = el;
          }}
          data-name="micro-app-container"
          style={microAppsContainerStyleComputed}
        ></div>
      )}
    </div>
  );
}
