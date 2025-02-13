import { describe, expect, test } from "@jest/globals";
import { createRouter } from "@/domains/router";
import { JSDOM, DOMWindow } from "jsdom";

describe("Path Parameters", () => {
  let window: DOMWindow;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`, { url: "http://localhost/" });
    window = dom.window;
  });

  test("라우터는 URL에서 path parameter를 식별할 수 있다.", () => {
    const mockFn = jest.fn();
    const router = createRouter();
    router.initialize({
      window: window as unknown as Window,

      routes: [{ path: "/test/:city", handler: mockFn }],
    });

    router.navigate("/test/seoul");

    expect(mockFn).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { city: "seoul" },
      })
    );
  });

  test("라우터는 URL에서 search parameter를 식별할 수 있다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();

    router.initialize({
      window: window as unknown as Window,
      routes: [{ path: "/test/:city", handler: mockFn }],
    });
    router.navigate("/test/seoul?province=gangnam");

    const actualArgs = mockFn.mock.calls[0][0];
    expect(actualArgs.params).toEqual({ city: "seoul" });
    expect(actualArgs.searchParams.toString()).toBe("province=gangnam");
  });

  test("라우터는 getParams를 통해 현재 route의 params 에 대한 정보를 가져올 수 있다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();

    router.initialize({
      window: window as unknown as Window,
      routes: [{ path: "/test/:city", handler: mockFn }],
    });
    router.navigate("/test/seoul?province=gangnam");

    const params = router.getParams();
    expect(params).toEqual({
      params: { city: "seoul" },
      searchParams: new URLSearchParams("province=gangnam"),
    });
  });

  test("route handler 내부에서 getParams를 통해 현재 라우트에 대한 정보를 가져올 수 있다.", () => {
    const router = createRouter();

    router.initialize({
      window: window as unknown as Window,
      routes: [
        {
          path: "/test/:city",
          handler: () => {
            const params = router.getParams();

            expect(params).toEqual({
              params: { city: "seoul" },
              searchParams: new URLSearchParams("province=gangnam"),
            });
          },
        },
      ],
    });

    router.navigate("/test/seoul?province=gangnam");
  });

  test("앱 최초 진입 시에도 route handler 내부에서 getParams를 통해 현재 라우트에 대한 정보를 가져올 수 있다.", () => {
    const dom = new JSDOM(`<!DOCTYPE html>`, {
      url: "http://localhost/test/seoul?province=gangnam",
    });
    window = dom.window;

    const router = createRouter();

    router.initialize({
      window: window as unknown as Window,
      routes: [
        {
          path: "/test/:city",
          handler: () => {
            const params = router.getParams();

            expect(params).toEqual({
              params: { city: "seoul" },
              searchParams: new URLSearchParams("province=gangnam"),
            });
          },
        },
      ],
    });
  });
});
