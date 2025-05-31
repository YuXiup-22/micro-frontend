/**
 * 管道总线：
 * 1.
 */
import {
  containerChannelItem,
  type containerChannelItemType,
} from "./container";
type BusChannel = containerChannelItemType;
const busChannel: BusChannel = {
  ...containerChannelItem,
};
export const bus = <T extends keyof BusChannel>(name: T): BusChannel[T] => {
  return busChannel[name];
};
