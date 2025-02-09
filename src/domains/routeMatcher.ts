import { Route } from "../types";
import { getURLObjFromPath } from "../utils";

export const matchRoute = (path: string, routes: Route[]) => {
  const urlObj = getURLObjFromPath(path);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.search
    ? new URLSearchParams(urlObj.search)
    : undefined;

  for (const route of routes) {
    const { isMatch, params } = matchPath(pathname, route.path);
    if (isMatch) {
      return { params, searchParams, ...route };
    }
  }
  return null;
};

const matchPath = (pathname: string, route: string) => {
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

    if (routePart === "*") {
      break;
    }
    if (routePart.startsWith(":")) {
      params[routePart.substring(1)] = pathPart;
      continue;
    }
    if (routePart !== pathPart) {
      isMatch = false;
      break;
    }
  }

  if (!routeParts.includes("*") && pointerRouteParts !== pointerPathParts) {
    isMatch = false;
  }

  return { isMatch, params };
};
