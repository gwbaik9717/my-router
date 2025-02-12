import {
  Route,
  RouteHandler,
  NavigateOptions,
  MatchedRoute,
  Params,
} from "@/types";
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

  // Current Matching Route
  let currentRoute: MatchedRoute | null = null;

  const handleRouteBeforeLoad = (route: MatchedRoute) => {
    if (!route.beforeLoad) {
      return;
    }

    route.beforeLoad({
      path: route.path,
      params: route.params,
    });
  };

  const handleRouteAfterLoad = (route: MatchedRoute) => {
    route.handler(route.params);
    currentRoute = route;
  };

  const processRoute = (path: string): MatchedRoute | null => {
    const route = matchRoute(path, routes);
    if (!route) {
      return null;
    }

    try {
      handleRouteBeforeLoad(route);
    } catch (e: unknown) {
      return null;
    }

    return route;
  };

  const addRoute = (route: Route) => {
    routes.push(route);
  };

  const addRoutes = (newRoutes: Array<Route>) => {
    routes.push(...newRoutes);
  };

  return {
    initialize: (options?: RouterOptions) => {
      const window = options?.window ?? globalThis.window;
      if (!window) throw new Error("Router requires a window object");

      if (options?.routes) {
        addRoutes(options.routes);
      }

      const handleRoute = () => {
        const route = processRoute(window.location.pathname);
        if (route) {
          handleRouteAfterLoad(route);
        }
      };

      // popstate 이벤트 헨들러 등록
      historyActions = createHistoryActions(window);
      historyActions.listenPopState(handleRoute);

      // Handle initial route
      handleRoute();

      initialized = true;
    },

    addRoute,
    addRoutes,

    navigate: (path: string, options: NavigateOptions = {}) => {
      if (!initialized) {
        throw new Error("Router should be initialized first");
      }

      const route = processRoute(path);
      if (route) {
        historyActions.navigate(path, options);

        currentRoute = route;

        handleRouteAfterLoad(route);
      }
    },

    getParams: (): Params => {
      if (!initialized) {
        throw new Error("Router should be initialized first");
      }

      if (!currentRoute) {
        throw new Error("There is no matching route.");
      }

      return currentRoute.params;
    },
  };
};
