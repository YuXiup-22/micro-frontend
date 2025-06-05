import cloneDeep from "lodash-es/cloneDeep";
/**
 * 生成固定格式的通道数据
 */
interface WatchProps<T> {
  /** 数据变化后回调 */
  cb: (newData: T, oldData: T) => void;
  /** 只监听部分数据。默认监听所有,只要监听key数据发生变化，就会触发回调 */
  watchKeys?: (keyof T)[];
  id: string;
}
type SmartPick<T, K extends keyof T | never = never> = [K] extends [never]
  ? T
  : Pick<T, K>;
const busChannelData: any = {};
const watchers: Array<WatchProps<any>> = [];
/** 生成唯一ID */
const genId = (n: number) => {
  return [...Array(n)]
    .map(() => Math.random().toString()[2])
    .join("")
    .padEnd(n, "")
    .slice(0, n);
};
/** watch内部变化，通知回调，每次set数据后，就需要检查是否变化 */
const handleWatchCheck = (payload: any, newData: any, oldData: any) => {
  watchers.map((item) => {
    const hasWatchKeys = (item.watchKeys?.length ?? 0) > 0;
    // 至少有一个keys在payload里就需要触发回调
    const keysChanged =
      hasWatchKeys &&
      Object.keys(payload).some((pItem) => item.watchKeys?.includes(pItem));
    // 没有设置keyWatch或者设置且有更新时
    if (!hasWatchKeys || keysChanged) {
      item.cb(newData, oldData);
    }
  });
};
export const generateData = <T>(name: string, data: T) => {
  busChannelData[name] = data;
  return {
    /** 获取对应的通道数据 */
    get: <K extends keyof T>(
      keyList?: K[]
    ): [K] extends [never] ? T : Pick<T, K> => {
      // 获取所有数据
      if (!(keyList && keyList.length > 0)) return busChannelData[name];
      // 获取部分数据
      const res: any = {};
      keyList?.map((key) => {
        res[key] = busChannelData[name]?.[key];
      });
      return res;
    },
    /** 设置对应的通道数据 */
    set: (
      payload: Partial<T>,
      opt?: {
        /** 是否合并老数据,不合并直接替换,默认合并 */
        merge?: boolean;
      }
    ) => {
      if (!payload) return;
      if (typeof payload !== "object") return;
      // 只有部分或全部T类型的对象才符合
      const merge = opt?.merge || true;
      const oldData = cloneDeep(busChannelData[name]);
      if (merge) {
        Object.assign(busChannelData[name], payload || {});
      } else {
        busChannelData[name] = payload as T;
      }
      handleWatchCheck(payload, cloneDeep(busChannelData[name]), oldData);
    },
    // cancelWatch(id:string):()=>{
    //   return false,
    // },
    /** 可能会有多个监听，需要同时储存所有监听回调，当对应的数据发生变化时，多个监听回调都需要触发 */
    watch: ({ cb, watchKeys }: Omit<WatchProps<T>, "id">) => {
      const id = genId(10);
      watchers.push({
        id,
        cb,
        watchKeys: watchKeys || [],
      });
      /**取消监听 */
      return () => {
        const index = watchers.findIndex((item) => item.id === id);
        if (!index) return;
        watchers.slice(index, 1);
      };
    },
  };
};
