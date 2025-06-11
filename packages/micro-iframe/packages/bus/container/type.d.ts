type RouterConfig = {
  mode: "history" | "hash";
};
/**
 * 基础框架初始化数据：
 * 应用挂载节点/应用路由模式/自定义基础组件/子应用数据
 */
type RouterConfig = {
  /** 默认history */
  mode?: "history" | "hash";
  /** 是否自动同步路由，默认同步 */
  sync?: boolean;
};
export type MicroAppItem = {
  /**子应用名称，唯一标识 */
  name: string;
  /**子应用来源（协议+主机+端口） */
  origin: string;
  /**子应用路由激活规则，唯一规则，会使用picomatch来匹配glob,/micro-app/test*后面所有的都被是为同一个  */
  activeRule: string;
  /**路由信息 */
  router?: RouterConfig;

  [key: string]: any;
};
export type InitContainerData = {
  /** 自定义框架base组件 */
  customBaseCom?: {
    header?: React.ComponentType;
    menu?: React.ComponentType;
    tab?: React.ComponentType;
  };
  /** 框架挂载点，支持 #id,dom,默认值#root。支持document.body或者其他dom */
  iframeContainer?: string | HTMLElement;
  /**路由配置 */
  router?: RouterConfig;
  /**子应用列表 */
  microApps?: MicroAppItem[];

  /** */
  type?: "mainApp" | "microApp";
};
/** 主应用初始化数据 */
export type MainAppInitData = Omit<InitContainerData, "type">;
/**
 * 子应用初始化数据
 * 子应用单独开启，只需要关注自身挂载点位置，其余都由主应用决定
 *  */
export type MicroAppInitData = Omit<
  InitContainerData,
  "type" | "microApps" | "router"
>;
