type _Function = (...args: any) => any;

type NavigateOptions = {
  replace?: boolean;
  state?: any;
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
        const route = router.getRoute(path);

        if (!route) {
          throw new Error("Path is not registered");
        }

        const { handler, params } = route;

        if (!handler) {
          throw new Error("Path is not registered");
        }

        handler(params);
      });

      initialized = true;
    },

    addRoute: (path: string, handler: _Function) => {
      routes.set(path, handler);
    },

    getRoute: (
      path: string
    ): {
      handler: _Function;
      params?: Record<string, string>;
    } | null => {
      if (routes.has(path)) {
        return {
          handler: routes.get(path)!,
        };
      }

      for (const [route, handler] of routes) {
        const routeParts = route.split("/");
        const pathParts = path.split("/");

        if (routeParts.length !== pathParts.length) {
          continue;
        }

        const params: Record<string, string> = {};
        let isMatch = true;

        for (let i = 0; i < routeParts.length; i++) {
          // routePart 가 ':' 로 시작할 때
          if (routeParts[i].startsWith(":")) {
            const paramName = routeParts[i].substring(1);
            params[paramName] = pathParts[i];
            continue;
          }

          if (routeParts[i] !== pathParts[i]) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          return { handler, params };
        }
      }

      return null;
    },

    navigate: (path: string, options: NavigateOptions = {}) => {
      if (!initialized) {
        throw new Error("Router should be initialized first");
      }

      const route = router.getRoute(path);

      if (!route) {
        throw new Error("Path is not registered");
      }

      const { handler, params } = route;

      const newUrl = new URL(path, userWindow.location.origin).toString();

      if (options.replace) {
        userWindow.history.replaceState(options.state || {}, "", newUrl);
      } else {
        userWindow.history.pushState(options.state || {}, "", newUrl);
      }

      try {
        handler(params);
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw e;
        }
      }
    },
  };

  return router;
};
