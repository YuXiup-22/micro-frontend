import { generateData } from "../generate";
import * as postRobot from "post-robot";
const channelName = "mainApp";
const channelData = {};
const channelItemData = generateData<typeof channelData>(
  channelName,
  channelData
);
export type microAppDataItem = {
  name: string;
  contentWindow: Window | null;
  [key: string]: any;
};
const connectMicroAppData = new Map<string, microAppDataItem>();
const connectMicro = (microApp: microAppDataItem) => {
  connectMicroAppData.set(microApp.name, microApp);
};
// type ParentListner = "MOUNTED";
type ChildListner = "syncRouter";
const sendToMicroApp = (name: string, key: ChildListner, data?: any) => {
  const microAppItem = connectMicroAppData.get(name);
  if (!microAppItem) return [{ msg: "micro-app not exist" }, null];
  postRobot
    .send(microAppItem.contentWindow, key, data)
    .then((res) => [null, res])
    .catch((err) => [err, null]);
};
const channelItem = {
  data: channelItemData,
  expose: {
    connectMicro,
  },
  cros: {
    send: sendToMicroApp,
    on: (name: ParentListner, opt1: any, opt2?: any) =>
      postRobot.on(name, opt1, opt2),
  },
};
export const mainAppChannelItem = {
  [channelName]: channelItem,
};
export type mainAppChannelItemType = {
  [channelName]: typeof channelItem;
};
