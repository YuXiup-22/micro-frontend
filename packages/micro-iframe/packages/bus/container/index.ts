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
};
// 生成container管道所有数据和管理方法
const channelItemData = generateData<typeof channelData>(
  channelName,
  channelData
);
const channelItem = {
  data: channelItemData,
  event: mitt<Event>(),
};
export const containerChannelItem = {
  [channelName]: channelItem,
};
export type containerChannelItemType = {
  [channelName]: typeof channelItem;
};
