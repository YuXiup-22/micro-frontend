import { generateData } from "../generate";
import * as postRobot from "post-robot";
type ChildListener = "syncRouter";
const channelName = "microApp";

const channelData = {};
const channelItemData = generateData<typeof channelData>(
  channelName,
  channelData
);

const channelItem = {
  data: channelItemData,
  cros: {
    on: (name: ChildListener, opt1: any, opt2?: any) =>
      postRobot.on(name, opt1, opt2),
  },
};

export const microAppChannelItem = {
  [channelName]:channelItem
}
export type MicroAppItemType = {
  [channelName]:typeof channelItem
}
