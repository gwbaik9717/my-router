import { NavigateOptions } from "../types";

export const createHistoryActions = (window: Window) => ({
  navigate: (path: string, options: NavigateOptions = {}) => {
    const newUrl = new URL(path, window.location.origin).toString();

    if (options.replace) {
      window.history.replaceState(options.state || {}, "", newUrl);
    } else {
      window.history.pushState(options.state || {}, "", newUrl);
    }
  },

  listenPopState: (handler: (event: PopStateEvent) => void) => {
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  },
});
