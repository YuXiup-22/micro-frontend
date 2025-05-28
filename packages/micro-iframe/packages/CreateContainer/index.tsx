import { createRoot } from "react-dom/client";
import ContainerLayout from "./Container";
import type { ContainerDomRefs } from "./Container";
import type { CreateMainAppProps } from "../CreateMainApp/index";
export function CreateContainer(
  props: CreateMainAppProps
): Promise<ContainerDomRefs> {
  return new Promise((resolve) => {
    console.log(props, "props-----------");
    const iframeContainer = "root";
    const ContainerDom = document.getElementById(iframeContainer);

    const handleRefsReady = (refs: ContainerDomRefs) => {
      resolve(refs);
    };

    createRoot(ContainerDom!).render(
      <ContainerLayout
        onRefsReady={handleRefsReady}
        customBaseCom={props.customBaseCom}
      />
    );
  });
}
