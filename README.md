# Ganu Router

A lightweight TypeScript router for Single Page Applications with support for path parameters, route guards, and browser history management.

## Installation

```bash
npm install ganu-router
```

## Quick Start

```typescript
import { createRouter } from "ganu-router";

const router = createRouter();

// Initialize with routes
router.initialize({
  routes: [
    {
      path: "/",
      handler: () => {
        document.getElementById("app").innerHTML = "Home";
      },
    },
    {
      path: "/users/:id",
      handler: ({ params }) => {
        document.getElementById("app").innerHTML = `User: ${params.id}`;
      },
      beforeLoad: ({ params }) => {
        // Guard route access
        if (!isAuthenticated()) {
          throw router.navigate("/login");
        }
      },
    },
  ],
});

router.navigate("/users/123");
```

## API Reference

### `createRouter()`

Creates a new router instance.

### `router.initialize(options?: RouterOptions)`

Initializes the router with optional configuration:

```typescript
type RouterOptions = {
  routes?: Array<RouteConfig>; // Initial routes
  window?: Window; // Custom window object for SSR
};
```

### `router.addRoute(route: RouteConfig)`

Registers a single route dynamically. Typically, adding a route within the `router.initialize` method is sufficient for most use cases.

```typescript
type RouteConfig = {
  path: string; // URL pattern
  handler: RouteHandler; // RouteConfig handler function
  beforeLoad?: BeforeLoadHandler; // Guard hook
};
```

### `router.addRoutes(routes: Array<RouteConfig>)`

Registers multiple routes at once. Typically, adding routes within the `router.initialize` method is sufficient for most use cases.


### `router.navigate(path: string, options?: NavigateOptions)`

Navigates to a new route:

```typescript
type NavigateOptions = {
  replace?: boolean; // Replace current history entry
  state?: any; // State data for history entry
};
```

## RouteConfig Patterns

- Static paths: `/about`
- Parameters: `/users/:id`
- Wildcards: `/docs/*` or `/blog/*/comments`
- Query strings: `/docs?lang=en` or `/search?q=ganu&sort=asc`

## RouteConfig Guards

Use `beforeLoad` to protect routes or perform actions before navigation:

```typescript
router.addRoute({
  path: "/admin",
  handler: showAdminPanel,
  beforeLoad: ({ path, params }) => {
    if (!hasAdminAccess()) {
      throw router.navigate("/login");
    }
  },
});
```

## License

MIT
