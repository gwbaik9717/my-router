export type PathParams = Record<string, string>;

export type Params = {
  params?: PathParams;
  searchParams?: URLSearchParams;
};

export type RouteHandler = (params: Params) => any;

export type Route = {
  path: string;
  handler: RouteHandler;
};

export type NavigateOptions = {
  replace?: boolean;
  state?: any;
};
