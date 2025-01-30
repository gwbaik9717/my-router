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

    if (!app) {
      throw new Error("Root Element not found");
    }

    const innerText = "Home Page";

    const Component = () => {
      app.innerText = innerText;
    };

    router.init(window as unknown as Window);
    router.addRoute("/", Component);

    router.navigate("/");
    expect(app.innerText).toBe(innerText);
  });

  test("라우터의 navigate 메소드를 호출하면 history 스택에 새로운 엔트리가 추가되고, URL이 변경된다.", () => {
    const router = createRouter();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.init(window as unknown as Window);
    router.addRoute("/test", () => {});
    router.navigate("/test");

    expect(window.location.href).toBe("http://localhost/test");
    expect(window.history.length).toBe(2);
  });

  test("라우터의 navigate 메소드를 호출할때 `replace` 옵션을 사용하면 history 스택에 새로운 엔트리가 추가되지 않고, URL만 변경된다.", () => {
    const router = createRouter();
    const app = document.getElementById("app");

    if (!app) {
      throw new Error("Root Element not found");
    }

    router.init(window as unknown as Window);
    router.addRoute("/test", () => {});
    router.navigate("/test", {
      replace: true,
    });

    expect(window.location.href).toBe("http://localhost/test");
    expect(window.history.length).toBe(1);
  });
});
