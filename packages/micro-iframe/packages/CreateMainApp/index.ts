import { CreateContainer } from "../CreateContainer";
import type { ContainerDomRefs } from "../CreateContainer/Container";
import { initialRouterEventListener, CreateRouterRuleHandle } from "../router";
import type { MainAppInitData } from "../bus/container/type";
import { bus } from "../bus/index";
import { CreateIframeManager } from "../iframeManager";
/**
 * 提供：基础框架渲染，暴露主应用挂载节点，路由代理，
 * 1.创建基础框架，暴露挂载节点
 */
export async function CreateMainApp(
  props?: MainAppInitData
): Promise<ContainerDomRefs> {
  if (!props) props = {};
  const { microApps = [] } = props;
  const layoutRefs = await CreateContainer({ ...props, type: "mainApp" });
  const containerBus = bus("container");
  containerBus.data.set({
    microApps,
    iframeMountDom: layoutRefs.microAppContainer,
  });
  const { registerIframe, checkIframeStatus, loadIfram, hideIframe } =
    CreateIframeManager();

  const { addCustomRouterEventListener } = initialRouterEventListener();
  const routerRule = CreateRouterRuleHandle();
  microApps
    .filter((item) => item.activeRule)
    .map((item) => {
      routerRule.addRule(item.name, item.activeRule);
      registerIframe(item.name, item);
    });
  const handleCustomRouterEvent = () => {
    const mainAppRouterMode =
      containerBus.data.get().initOptions?.router?.mode || "history";
    const { pathname, search, hash } = new URL(window.location.href);
    let path = pathname + search;
    // hash模式，真正的path是hash后面的路由
    if (mainAppRouterMode === "hash") path = hash.replace("#", "");
    // 去匹配对应的microApp,没有则不做任何处理，相当于主应用内部路由跳转
    const matchMicroAppRule = routerRule.matchRule(path);
    const matchMicroAppData = containerBus.data
      .get(["microApps"])
      .microApps.find((item) => {
        if (!matchMicroAppRule) return false;
        return matchMicroAppRule === item.name;
      });
    if (!matchMicroAppData) {
      containerBus.data.set({ activeMicroAppName: "" });
      // 路由没有匹配的子应用，被认为是切回主应用，则deactived当前激活子应用
      hideIframe();
      return;
    }
    containerBus.data.set({ activeMicroAppName: matchMicroAppData.name });
    // 根据子应用的状态激活
    if (checkIframeStatus(matchMicroAppData.name, "REGISTERED")) {
      // TODO:加载激活子应用
      loadIfram(matchMicroAppData.name, {
        path,
      });
    }
  };
  addCustomRouterEventListener(
    ["replaceState", "pushState"],
    handleCustomRouterEvent
  );
  return layoutRefs;
}
