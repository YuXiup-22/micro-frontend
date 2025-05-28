import { CreateContainer } from "../CreateContainer";
import type { ContainerDomRefs } from "../CreateContainer/Container";
/**
 * 提供：基础框架渲染，暴露主应用挂载节点，路由代理，
 * 1.创建基础框架，暴露挂载节点
 */
export async function CreateMainApp(): Promise<ContainerDomRefs> {
  const layoutRefs = await CreateContainer();
  return layoutRefs;
}
