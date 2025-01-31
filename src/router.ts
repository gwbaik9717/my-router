type PathParams = Record<string, string>;

type Params = {
  params?: PathParams;
  searchParams?: URLSearchParams;
};

type RouteHandler = (params: Params) => any;

type Route = {
  path: string;
  handler: RouteHandler;
};

type NavigateOptions = {
  replace?: boolean;
  state?: any;
};

export const createRouter = () => {
  const routes = new Array<Route>();
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

        const { handler, params, searchParams } = route;

        handler({
          params,
          searchParams,
        });
      });

      initialized = true;
    },

    addRoute: (path: string, handler: RouteHandler) => {
      routes.push({
        path,
        handler,
      });
    },

    getRoute: (
      path: string
    ): {
      handler: RouteHandler;
      params?: PathParams;
      searchParams?: URLSearchParams;
    } | null => {
      const urlObj = getURLObjFromPath(path);
      const pathname = urlObj.pathname;
      const searchParams = urlObj.search
        ? new URLSearchParams(urlObj.search)
        : undefined;

      for (const { path: route, handler } of routes) {
        const routeParts = route.split("/");
        const pathParts = pathname.split("/");
        const params: Record<string, string> = {};

        let isMatch = true;
        let pointerRouteParts = 0;
        let pointerPathParts = 0;

        while (
          pointerRouteParts < routeParts.length &&
          pointerPathParts < pathParts.length
        ) {
          const routePart = routeParts[pointerRouteParts++];
          const pathPart = pathParts[pointerPathParts++];

          // routePart 가 '*' 일 때
          if (routePart === "*") {
            break;
          }

          // routePart 가 ':' 로 시작할 때
          if (routePart.startsWith(":")) {
            const paramName = routePart.substring(1);
            params[paramName] = pathPart;
            continue;
          }

          if (routePart !== pathPart) {
            isMatch = false;
            break;
          }
        }

        if (
          !routeParts.includes("*") &&
          pointerRouteParts !== pointerPathParts
        ) {
          return null;
        }

        if (isMatch) {
          return { handler, params, searchParams };
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

      const { handler, params, searchParams } = route;

      const newUrl = new URL(path, userWindow.location.origin).toString();

      if (options.replace) {
        userWindow.history.replaceState(options.state || {}, "", newUrl);
      } else {
        userWindow.history.pushState(options.state || {}, "", newUrl);
      }

      try {
        handler({
          params,
          searchParams,
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw e;
        }
      }
    },
  };

  return router;
};

const getURLObjFromPath = (path: string) => {
  const dummyUrl = "https://developer.mozilla.org";
  return new URL(path, dummyUrl);
};
