import {
  useEffect,
  useRef,
  useMemo,
  type CSSProperties,
  useState,
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
  return data;
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
  const containerData = useContainerData();
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
  }, []);
  // const microAppContainerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (onRefsReady && teleportDomRefs.current) {
      onRefsReady(teleportDomRefs.current);
    }
  }, [onRefsReady, teleportDomRefs]);
  return (
    <div className={styles["iframe-base"]}>
      <header>
        <div
          ref={(el) => {
            teleportDomRefs.current.headerDom = el;
          }}
        >
          {CustomHeader ? <CustomHeader /> : "header"}
        </div>
      </header>
      <section className={styles["iframe-base-content"]}>
        <aside>
          <div
            ref={(el) => {
              teleportDomRefs.current.menuDom = el;
            }}
            className={styles["aside-content"]}
          >
            {CustomMenu ? <CustomMenu /> : "aside"}
          </div>
        </aside>
        <main className={styles["main-content"]}>
          <header>
            <div
              ref={(el) => {
                teleportDomRefs.current.tabDom = el;
              }}
            >
              {CustomTab ? <CustomTab /> : "tab"}
            </div>
          </header>
          <section className={styles["main-section"]}>
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
