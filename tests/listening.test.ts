import { describe, expect, test } from "@jest/globals";
import { createRouter } from "@/index";
import { JSDOM, DOMWindow } from "jsdom";

describe("Listening", () => {
  let window: DOMWindow;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`, { url: "http://localhost/" });
    window = dom.window;
  });

  test("라우터는 popstate 이벤트를 감지하여 URL이 변경되면 등록된 핸들러를 실행한다.", () => {
    const router = createRouter(window as unknown as Window);
    const mockFn = jest.fn();

    router.addRoute("/test", mockFn);

    window.history.pushState({}, "", "/test");
    window.dispatchEvent(new window.PopStateEvent("popstate"));

    expect(window.location.href).toBe("http://localhost/test");
    expect(mockFn).toHaveBeenCalled();
  });
});
