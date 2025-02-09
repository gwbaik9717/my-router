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

      routes: [
        { path: "/", handler: () => {} },
        { path: "/test/:city", handler: mockFn },
      ],
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
      routes: [
        { path: "/", handler: () => {} },
        { path: "/test/:city", handler: mockFn },
      ],
    });
    router.navigate("/test/seoul?province=gangnam");

    const actualArgs = mockFn.mock.calls[0][0];
    expect(actualArgs.params).toEqual({ city: "seoul" });
    expect(actualArgs.searchParams.toString()).toBe("province=gangnam");
  });
});
