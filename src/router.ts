type _Function = (...args: any) => any;

export const createRouter = () => {
  const routes = new Map<string, _Function>();
  let globalWindow: Window;

  const router = {
    init: (window: Window) => {
      globalWindow = window;

      window.addEventListener("popstate", () => {});
    },

    addRoute: (path: string, handler: _Function) => {
      routes.set(path, handler);
    },

    push: (path: string) => {
      const handler = routes.get(path);

      if (!handler) {
        throw new Error("Path is not registered");
      }

      handler();
    },
  };

  return router;
};
