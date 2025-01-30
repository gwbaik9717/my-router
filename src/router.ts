type _Function = (...args: any) => any;

type NavigateOptions = {
  replace: boolean;
};

export const createRouter = () => {
  const routes = new Map<string, _Function>();
  let initialized = false;
  let userWindow: Window;

  const router = {
    initialize: (window: Window = globalThis.window) => {
      if (!window) {
        throw new Error("Router requires a window object");
      }

      userWindow = window;
      userWindow.addEventListener("popstate", (event: PopStateEvent) => {
        const path = userWindow.location.pathname;

        const handler = routes.get(path);

        if (!handler) {
          throw new Error("Path is not registered");
        }

        handler();
      });

      initialized = true;
    },

    addRoute: (path: string, handler: _Function) => {
      routes.set(path, handler);
    },

    navigate: (path: string, options?: NavigateOptions) => {
      if (!initialized) {
        throw new Error("Router should be initialized first");
      }

      const handler = routes.get(path);

      if (!handler) {
        throw new Error("Path is not registered");
      }

      const newUrl = new URL(path, userWindow.location.origin).toString();

      if (options && options.replace) {
        userWindow.history.replaceState({}, "", newUrl);
      } else {
        userWindow.history.pushState({}, "", newUrl);
      }

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
