import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import type { CreateMainAppProps } from "../CreateMainApp/index";
export type ContainerDomRefs = {
  headerDom: HTMLDivElement | null;
  menuDom: HTMLDivElement | null;
  tabDom: HTMLDivElement | null;
  mountDom: HTMLDivElement | null;
};
interface ContainerLayoutProps {
  onRefsReady?: (refs: ContainerDomRefs) => void;
  customBaseCom?: CreateMainAppProps["customBaseCom"];
}
export default function ContainerLayout(props: ContainerLayoutProps) {
  const { onRefsReady, customBaseCom } = props;
  console.log(customBaseCom,'customBaseCom')
  const teleportDomRefs = useRef<ContainerDomRefs>({
    headerDom: null,
    menuDom: null,
    tabDom: null,
    mountDom: null,
  });
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
          {customBaseCom?.header || "header"}
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
            {customBaseCom?.menu || "aside"}
          </div>
        </aside>
        <main className={styles["main-content"]}>
          <header>
            <div
              ref={(el) => {
                teleportDomRefs.current.tabDom = el;
              }}
            >
              {customBaseCom?.tab || "tab"}
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
    </div>
  );
}
