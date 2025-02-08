import { Route, RouteHandler, NavigateOptions } from "@/types";
import { matchRoute } from "@/domains/routeMatcher";
import { createHistoryActions } from "@/domains/historyManager";

export const createRouter = () => {
  const routes = new Array<Route>();
  let initialized = false;
  let historyActions: ReturnType<typeof createHistoryActions>;

  const handleRouteChange = (path: string) => {
    const route = matchRoute(path, routes);
    if (!route) throw new Error("Path is not registered");

    route.handler({
      params: route.params,
      searchParams: route.searchParams,
    });
  };

  return {
    initialize: (window: Window = globalThis.window) => {
      if (!window) {
        throw new Error("Router requires a window object");
      }

      historyActions = createHistoryActions(window);
      historyActions.listenPopState(() => {
        handleRouteChange(window.location.pathname);
      });

      initialized = true;
    },

    addRoute: (path: string, handler: RouteHandler) => {
      routes.push({ path, handler });
    },

    addRoutes: (newRoutes: Array<Route>) => {
      routes.push(...newRoutes);
    },

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
