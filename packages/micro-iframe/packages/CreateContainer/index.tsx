import { createRoot } from "react-dom/client";
import ContainerLayout from "./Container";
import type { ContainerDomRefs } from "./Container";
import { bus } from "../bus/index";
import type { InitContainerData } from "../bus/container/type";
export function CreateContainer(
  props: InitContainerData
): Promise<ContainerDomRefs> {
  return new Promise((resolve) => {
    const { iframeContainer = "#root" } = props || {};
    let containerDom: any;

    if (typeof iframeContainer === "string")
      containerDom = document.getElementById(iframeContainer.replace("#", ""));

    if (iframeContainer instanceof HTMLElement) containerDom = iframeContainer;

    if (!containerDom)
      throw new Error("iframeContainer must to be #id string or HTMLElement");

    const containerBus = bus("container");
    console.log(containerBus.data.get(), props.type);
    containerBus.data.set({ initOptions: props });
    console.log(containerBus.data.get(), props.type);
    const handleRefsReady = (refs: ContainerDomRefs) => {
      resolve(refs);
    };
    createRoot(containerDom!).render(
      <ContainerLayout
        onRefsReady={handleRefsReady}
        customBaseCom={props.customBaseCom}
        type={props.type}
      />
    );
  });
}
