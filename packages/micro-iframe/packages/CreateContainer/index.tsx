import { createRoot } from "react-dom/client";
import ContainerLayout from "./Container";
import type { ContainerDomRefs } from "./Container";
import type { CreateMainAppProps } from "../CreateMainApp/index";
export function CreateContainer(
  props: CreateMainAppProps
): Promise<ContainerDomRefs> {
  return new Promise((resolve) => {
    const { iframeContainer = "#root" } = props || {};
    let containerDom: any;

    if (typeof iframeContainer === "string")
      containerDom = document.getElementById(iframeContainer.replace("#", ""));

    if (iframeContainer instanceof HTMLElement) containerDom = iframeContainer;

    if (!containerDom)
      throw new Error("iframeContainer must to be #id string or HTMLElement");

    const handleRefsReady = (refs: ContainerDomRefs) => {
      resolve(refs);
    };

    createRoot(containerDom!).render(
      <ContainerLayout
        onRefsReady={handleRefsReady}
        customBaseCom={props.customBaseCom}
      />
    );
  });
}
