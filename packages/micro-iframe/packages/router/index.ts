import { initialHistoryCustomEvent } from "./history";
import picomatch from "picomatch";
type CustomRouterEventListenerTypes = "pushState" | "replaceState";
export const initialRouterEventListener = () => {
  // 重写history的push replace原始方法
  initialHistoryCustomEvent();
  const listener: {
    [key: string]: any;
  } = {};
  const addCustomRouterEventListener = (
    type: CustomRouterEventListenerTypes | CustomRouterEventListenerTypes[],
    cb: (e: any) => void
  ) => {
    let typeList = [type] as CustomRouterEventListenerTypes[];
    if (Array.isArray(type)) typeList = type;
    for (const typeItem of typeList) {
      window.addEventListener(typeItem, cb);
      if (!listener[typeItem]) listener[typeItem] = [];
      listener[typeItem].push(cb);
    }
  };
  return { addCustomRouterEventListener };
};
const routerRules = new Map();
export const CreateRouterRuleHandle = () => {
  return {
    addRule: (key: string, rule: string) => {
      routerRules.set(key, picomatch(rule));
    },
    matchRule: (path: string) => {
      const matchItem = [...routerRules].find(([name, matcher]) =>
        matcher(path)
      );
      if (!matchItem) return false;
      // 返回microName
      return matchItem[0];
    },
  };
};
