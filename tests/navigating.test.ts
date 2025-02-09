import { describe, expect, test } from "@jest/globals";
import { createRouter } from "@/domains/router";
import { JSDOM, DOMWindow } from "jsdom";

describe("Navigating", () => {
  let window: DOMWindow;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`, { url: "http://localhost/" });
    window = dom.window;
  });

  test("라우터의 navigate 메소드를 호출하면 등록한 핸들러가 실행된다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();

    router.initialize({
      window: window as unknown as Window,
      routes: [{ path: "/test", handler: mockFn }],
    });

    router.navigate("/test");

    expect(mockFn).toHaveBeenCalled();
  });

  test("라우터의 navigate 메소드를 호출하면 history 스택에 새로운 엔트리가 추가되고, URL이 변경된다.", () => {
    const router = createRouter();

    router.initialize({
      window: window as unknown as Window,
      routes: [{ path: "/test", handler: () => {} }],
    });
    router.navigate("/test");

    expect(window.location.href).toBe("http://localhost/test");
    expect(window.history.length).toBe(2);
  });

  test("라우터의 navigate 메소드를 호출할때 `replace` 옵션을 사용하면 history 스택에 새로운 엔트리가 추가되지 않고, URL만 변경된다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();

    router.initialize({
      window: window as unknown as Window,
      routes: [{ path: "/test", handler: mockFn }],
    });
    router.navigate("/test", { replace: true });

    expect(window.location.href).toBe("http://localhost/test");
    expect(mockFn).toHaveBeenCalled();
    expect(window.history.length).toBe(1);
  });

  test("라우터의 navigate 메소드를 호출할때 `state` 옵션을 사용하면 상태를 새로운 path로 전달할 수 있다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();
    const state = { userId: 123 };

    router.initialize({
      window: window as unknown as Window,
      routes: [{ path: "/test", handler: mockFn }],
    });
    router.navigate("/test", { state });

    expect(window.location.href).toBe("http://localhost/test");
    expect(mockFn).toHaveBeenCalled();
    expect(window.history.state).toEqual(state);
  });
});
