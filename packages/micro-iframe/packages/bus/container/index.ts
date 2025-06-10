import type { InitContainerData, MicroAppItem } from "./type";
import { generateData } from "../generate";
import mitt from "mitt";
/**
 * container全局管理内容
 * 1.跨组件通信：路由管理
 */
type Event = {
  /**
   * 顶部导航栏点击事件
   */
  navItemClick: any;
  /**左侧菜单项点击事件 */
  menuItemClick: any;
};

const channelName = "container";
const channelData = {
  /**子应用挂载Dom */
  iframeMountDom: null as Element | null,
  /**当前激活的子应用名称 */
  activeMicroAppName: "",
  /**子应用列表 */
  microApps: [] as MicroAppItem[],
  /**初始化数据 */
  initOptions: {} as InitContainerData,
  /** nav的BoundingClientRect信息 */
  navRect: { x: 0, y: 0, height: 0, width: 0 },

  /** menu的BoundingClientRect信息 */
  menuRect: { x: 0, y: 0, height: 0, width: 0 },

  /** tab的BoundingClientRect信息 */
  tabRect: { x: 0, y: 0, height: 0, width: 0 },

  /** mount的BoundingClientRect信息 */
  mountRect: { x: 0, y: 0, height: 0, width: 0 },

  /** 整个容器是否显示，默认为true，包括内容区域 */
  visible: undefined as boolean | undefined,

  /** 外框是否显示，默认为true，外框包括顶部导航栏，左侧菜单栏，tab标签栏 */
  frameVisible: undefined as boolean | undefined,

  /** 外框的顶部导航栏是否显示，默认为true，单独设置此项优先级高于frameVisible */
  navVisible: undefined as boolean | undefined,

  /** 外框的左侧菜单栏是否显示，默认为true，单独设置此项优先级高于frameVisible */
  menuVisible: undefined as boolean | undefined,

  /** 外框的tab标签栏是否显示，默认为true，单独设置此项优先级高于frameVisible */
  tabVisible: undefined as boolean | undefined,

  /** 内容区是否显示，默认为true，单独设置此项优先级高于visible */
  mountVisible: undefined as boolean | undefined,

  /** 子应用的置顶状态。默认是置顶，当置顶时，无法触发主应用layout的事件 */
  microAppStickStatue: false,
};
type LayoutDataKeys =
  | "navRect"
  | "menuRect"
  | "tabRect"
  | "mountRect"
  | "visible"
  | "frameVisible"
  | "navVisible"
  | "menuVisible"
  | "tabVisible"
  | "mountVisible";
export type ChanelDataKeyType = keyof typeof channelData;
// 生成container管道所有数据和管理方法
const channelItemData = generateData<typeof channelData>(
  channelName,
  channelData
);
const channelItem = {
  data: channelItemData,
  event: mitt<Event>(),
  expose: {
    /** 获取布局数据的keys */
    getLayoutDataKeys: (): LayoutDataKeys[] => {
      return [
        "navRect",
        "menuRect",
        "tabRect",
        "mountRect",
        "frameVisible",
        "menuVisible",
        "mountVisible",
        "navVisible",
        "tabVisible",
        "visible",
      ];
    },
  },
};
export const containerChannelItem = {
  [channelName]: channelItem,
};
export type containerChannelItemType = {
  [channelName]: typeof channelItem;
};
