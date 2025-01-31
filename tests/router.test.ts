import { describe, expect, test } from "@jest/globals";
import { createRouter } from "@/router";
import { JSDOM, DOMWindow } from "jsdom";

describe("unit test for configuring router", () => {
  let dom: JSDOM;
  let window: DOMWindow;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM(
      `<!DOCTYPE html><html><body><div id="app"></div></body></html>`,
      {
        url: "http://localhost/",
      }
    );
    window = dom.window;
    document = window.document;
  });

  test("라우터의 navigate 메소드를 호출하면 등록한 핸들러가 실행된다.", () => {
    const router = createRouter();
    const app = document.getElementById("app");
    const mockFn = jest.fn();

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.initialize(window as unknown as Window);
    router.addRoute("/test", mockFn);

    router.navigate("/test");
    expect(mockFn).toHaveBeenCalled();
  });

  test("라우터의 navigate 메소드를 호출하면 history 스택에 새로운 엔트리가 추가되고, URL이 변경된다.", () => {
    const router = createRouter();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.initialize(window as unknown as Window);
    router.addRoute("/test", () => {});
    router.navigate("/test");

    expect(window.location.href).toBe("http://localhost/test");
    expect(window.history.length).toBe(2);
  });

  test("라우터의 navigate 메소드를 호출할때 `replace` 옵션을 사용하면 history 스택에 새로운 엔트리가 추가되지 않고, URL만 변경된다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.initialize(window as unknown as Window);
    router.addRoute("/test", mockFn);

    router.navigate("/test", {
      replace: true,
    });

    expect(window.location.href).toBe("http://localhost/test");
    expect(mockFn).toHaveBeenCalled();
    expect(window.history.length).toBe(1);
  });

  test("라우터의 navigate 메소드를 호출할때 `state` 옵션을 사용하면 상태를 새로운 path로 전달할 수 있다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.initialize(window as unknown as Window);
    router.addRoute("/test", mockFn);

    const state = {
      userId: 123,
    };

    router.navigate("/test", {
      state,
    });

    expect(window.location.href).toBe("http://localhost/test");
    expect(mockFn).toHaveBeenCalled();
    expect(window.history.state).toEqual(state);
  });

  test("라우터는 popstate 이벤트를 감지하여 URL이 변경되면 등록된 핸들러를 실행한다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.initialize(window as unknown as Window);
    router.addRoute("/test", mockFn);

    // Simulate a URL change using history.pushState()
    window.history.pushState({}, "", "/test");

    // Manually trigger a "popstate" event
    window.dispatchEvent(new window.PopStateEvent("popstate"));

    expect(window.location.href).toBe("http://localhost/test");
    expect(mockFn).toHaveBeenCalled();
  });

  test("라우터는 URL에서 path parameter를 식별할 수 있다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.initialize(window as unknown as Window);
    router.addRoute("/test/:city", mockFn);

    router.navigate("/test/seoul");

    const paramsObj = {
      params: {
        city: "seoul",
      },
    };

    expect(mockFn).toHaveBeenCalledWith(expect.objectContaining(paramsObj));
  });

  test("라우터는 URL에서 search parameter를 식별할 수 있다.", () => {
    const router = createRouter();
    const mockFn = jest.fn();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.initialize(window as unknown as Window);
    router.addRoute("/test/:city", mockFn);
    router.navigate("/test/seoul?province=gangnam");

    const actualArgs = mockFn.mock.calls[0][0];
    expect(actualArgs.params).toEqual({ city: "seoul" });
    expect(actualArgs.searchParams.toString()).toBe("province=gangnam");
  });
});
