import { Route, RouteHandler, NavigateOptions } from "@/types";
import { matchRoute } from "@/domains/routeMatcher";
import { createHistoryActions } from "@/domains/historyManager";

export const createRouter = (window: Window = globalThis.window) => {
  const routes = new Array<Route>();
  let historyActions: ReturnType<typeof createHistoryActions>;

  if (!window) {
    throw new Error("Router requires a window object");
  }

  historyActions = createHistoryActions(window);

  const handleRouteChange = (path: string) => {
    const route = matchRoute(path, routes);
    if (!route) throw new Error("Path is not registered");

    route.handler({
      params: route.params,
      searchParams: route.searchParams,
    });
  };

  historyActions.listenPopState(() => {
    handleRouteChange(window.location.pathname);
  });

  // Handle initial route
  setTimeout(() => {
    handleRouteChange(window.location.pathname);
  }, 0);

  return {
    addRoute: (path: string, handler: RouteHandler) => {
      routes.push({ path, handler });
    },

    navigate: (path: string, options: NavigateOptions = {}) => {
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
