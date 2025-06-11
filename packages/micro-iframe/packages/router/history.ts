function createHistoryCustomEvent<T extends keyof History>(type: T) {
  const original = window.history[type];
  return function (this: unknown, ...args: Parameters<History[T]>) {
    const result = original.apply(this, args);
    const event = new Event(type);
    window.dispatchEvent(event);
    return result;
  };
}
let hasInit = false;
export const initialHistoryCustomEvent = () => {
  if (hasInit) return;
  hasInit = true;
  history.pushState = createHistoryCustomEvent("pushState");
  history.replaceState = createHistoryCustomEvent("replaceState");
};
