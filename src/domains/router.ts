import { Route, RouteHandler, NavigateOptions } from "@/types";
import { matchRoute } from "@/domains/routeMatcher";
import { createHistoryActions } from "@/domains/historyManager";

type RouterOptions = {
  routes?: Array<Route>;
  window?: Window;
};

export const createRouter = () => {
  const routes = new Array<Route>();
  let initialized = false;
  let historyActions: ReturnType<typeof createHistoryActions>;

  const handleRouteChange = (path: string) => {
    const route = matchRoute(path, routes);
    if (!route) {
      return;
    }

    route.handler({
      params: route.params,
      searchParams: route.searchParams,
    });
  };

  const addRoute = (path: string, handler: RouteHandler) => {
    routes.push({ path, handler });
  };

  const addRoutes = (newRoutes: Array<Route>) => {
    routes.push(...newRoutes);
  };

  return {
    initialize: (options?: RouterOptions) => {
      const window = options?.window ?? globalThis.window;

      if (!window) {
        throw new Error("Router requires a window object");
      }

      if (options?.routes && options.routes.length > 0) {
        addRoutes(options.routes);
      }

      historyActions = createHistoryActions(window);
      historyActions.listenPopState(() => {
        handleRouteChange(window.location.pathname);
      });

      // navigate on load
      handleRouteChange(window.location.pathname);

      initialized = true;
    },
    addRoute,
    addRoutes,
    navigate: (path: string, options: NavigateOptions = {}) => {
      if (!initialized) {
        throw new Error("Router should be initialized first");
      }

      try {
        handleRouteChange(path);
        historyActions.navigate(path, options);
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw e;
        }
      }
    },
  };
};
