import { createRoot } from "react-dom/client";
import ContainerLayout from "./Container";
import type { ContainerDomRefs } from "./Container";
export function CreateContainer(): Promise<ContainerDomRefs> {
  return new Promise((resolve) => {
    const iframeContainer = "root";
    const ContainerDom = document.getElementById(iframeContainer);

    const handleRefsReady = (refs: ContainerDomRefs) => {
      resolve(refs);
    };

    createRoot(ContainerDom!).render(
      <ContainerLayout onRefsReady={handleRefsReady} />
    );
  });
}
