/**
 * container全局管理内容
 * 1.跨组件通信：路由管理
 */
import mitt from "mitt";
type Event = {
  /**
   * 顶部导航栏点击事件
   */
  navItemClick: any;
};
const channelName = "container";

const channelItem = {
  event: mitt<Event>(),
};
export const containerChannelItem = {
  [channelName]: channelItem,
};
export type containerChannelItemType = {
  [channelName]: typeof channelItem;
};
