type _Function = (...args: any) => any;

export const createRouter = () => {
  const routes = new Map<string, _Function>();
  let isInitialized = false;
  let userWindow: Window;

  const router = {
    init: (window: Window = globalThis.window) => {
      if (!window) {
        throw new Error("Router requires a window object");
      }

      userWindow = window;
      userWindow.addEventListener("popstate", () => {});

      isInitialized = true;
    },

    addRoute: (path: string, handler: _Function) => {
      routes.set(path, handler);
    },

    navigate: (path: string) => {
      if (!isInitialized) {
        throw new Error("Router should be initialized first");
      }

      const handler = routes.get(path);

      if (!handler) {
        throw new Error("Path is not registered");
      }

      const newUrl = new URL(path, userWindow.location.origin).toString();
      userWindow.history.pushState({}, "", newUrl);

      try {
        handler();
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw e;
        }
      }
    },
  };

  return router;
};
