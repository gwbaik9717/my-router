import { describe, expect, test } from "@jest/globals";
import { createRouter } from "@/domains/router";
import { JSDOM, DOMWindow } from "jsdom";

describe("Configuring Routes", () => {
  let window: DOMWindow;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`, { url: "http://localhost/" });
    window = dom.window;
  });

  test("라우터는 등록한 라우트를 순서대로 검사한다.", () => {
    const router = createRouter();
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    router.initialize(window as unknown as Window);
    router.addRoute("/test", mockFn1);
    router.addRoute("/test", mockFn2);
    router.navigate("/test");

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();
  });

  test.each([
    { path: "*", navigatePath: "/test" },
    { path: "/test/*", navigatePath: "/test/123" },
    { path: "/*/test/*", navigatePath: "/test/123" },
  ])(
    "주소의 일부에 '*'를 사용하여 와일드카드 라우트를 등록할 수 있다.",
    ({ path, navigatePath }) => {
      const router = createRouter();
      const mockFn = jest.fn();

      router.initialize(window as unknown as Window);
      router.addRoute(path, mockFn);
      router.navigate(navigatePath);

      expect(mockFn).toHaveBeenCalled();
    }
  );

  test("라우터는 여러 개의 라우터를 동시에 등록할 수 있다.", () => {
    const router = createRouter();
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    router.initialize(window as unknown as Window);
    router.addRoutes([
      {
        path: "/test1",
        handler: mockFn1,
      },
      {
        path: "/test2",
        handler: mockFn2,
      },
    ]);

    router.navigate("/test2");

    expect(mockFn2).toHaveBeenCalled();
  });
});
