import { CreateContainer } from "../CreateContainer";
import type { ContainerDomRefs } from "../CreateContainer/Container";
/**
 * 提供：基础框架渲染，暴露主应用挂载节点，路由代理，
 * 1.创建基础框架，暴露挂载节点
 */
export interface CreateMainAppProps {
  /** 自定义框架base组件 */
  customBaseCom?: {
    header?: React.ComponentType;
    menu?: React.ComponentType;
    tab?: React.ComponentType;
  };
  /** 框架挂载点，支持 #id,dom,默认值#root。支持document.body或者其他dom */
  iframeContainer?: string | HTMLElement;
}
export async function CreateMainApp(
  props?: CreateMainAppProps
): Promise<ContainerDomRefs> {
  if (!props) props = {};
  const layoutRefs = await CreateContainer({ ...props });
  return layoutRefs;
}
