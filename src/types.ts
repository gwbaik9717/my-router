export type PathParams = Record<string, string>;

export type Params = {
  params?: PathParams;
  searchParams?: URLSearchParams;
};

export type RouteHandler = (params: Params) => any;

export type Location = {
  path: string;
  params: Params;
};

export type BeforeLoadHandler = (location: Location) => any;

export type Route = {
  path: string;
  handler: RouteHandler;
  beforeLoad?: BeforeLoadHandler;
};

export type MatchedRoute = Route & {
  params: Params;
};

export type NavigateOptions = {
  replace?: boolean;
  state?: any;
};
