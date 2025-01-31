# Ganu Router

Simple and lightweight TypeScript router for Single Page Applications.

## Installation

```bash
npm install ganu-router
```

## Quick Start

```typescript
import { createRouter } from "ganu-router";

const router = createRouter();
router.initialize();

// Basic route
router.addRoute("/", () => {
  document.getElementById("app").innerHTML = "Home";
});

// Path parameters
router.addRoute("/users/:id", ({ params }) => {
  document.getElementById("app").innerHTML = `User: ${params.id}`;
});

// Search parameters
router.addRoute("/search", ({ searchParams }) => {
  const query = searchParams.get("q");
  document.getElementById("app").innerHTML = `Search: ${query}`;
});

// Wildcard routes
router.addRoute("/docs/*", () => {
  document.getElementById("app").innerHTML = "Documentation";
});
```

## API

### `createRouter()`

Creates a new router instance.

### `router.initialize(window?: Window)`

- Initializes the router
- Optional window parameter for testing

### `router.addRoute(path: string, handler: RouteHandler)`

- Registers a new route
- Path can include parameters (`:param`) and wildcards (`*`)

### `router.navigate(path: string, options?: NavigateOptions)`

- Navigates to the specified path
- Options:
  - `replace`: Replace current history entry
  - `state`: Pass state data

## License

MIT
