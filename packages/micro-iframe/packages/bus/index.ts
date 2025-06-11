/**
 * 管道总线：
 * 1.
 */
import {
  containerChannelItem,
  type containerChannelItemType,
} from "./container";
import { mainAppChannelItem, type mainAppChannelItemType } from "./mainApp";
import { microAppChannelItem, type MicroAppItemType } from "./microApp";
type BusChannel = containerChannelItemType &
  mainAppChannelItemType &
  MicroAppItemType;
const busChannel: BusChannel = {
  ...containerChannelItem,
  ...mainAppChannelItem,
  ...microAppChannelItem,
};
export const bus = <T extends keyof BusChannel>(name: T): BusChannel[T] => {
  return busChannel[name];
};
