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

  test("라우터는 현재 URL을 기반으로 페이지 콘텐츠를 렌더링할 수 있다.", () => {
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

    router.push("/");
    expect(app.innerText).toBe(innerText);
  });
});
