### 요구사항

#### Configuring Routes

- [x] 라우터는 URL과 DOM 구성 요소를 매핑하는 라우팅 테이블을 가진다.
- [x] 라우터는 addRoute 메소드를 통해 라우팅 테이블에 새로운 라우트를 추가할 수 있다.

#### Navigating

- [x] 라우터의 navigate 메소드를 호출하면 등록한 핸들러가 실행된다.
- [x] 라우터의 navigate 메소드를 호출하면 history 스택에 새로운 엔트리가 추가되고, URL이 변경된다.
- [x] 라우터의 navigate 메소드를 호출할때 `replace` 옵션을 사용하면 history 스택에 새로운 엔트리가 추가되지 않고, URL만 변경된다.
- [x] 라우터의 navigate 메소드를 호출할때 `state` 옵션을 사용하면 상태를 새로운 path로 전달할 수 있다.

#### Listening

- [x] 라우터는 popstate 이벤트를 감지하여 URL이 변경되면 등록된 핸들러를 실행한다.

#### Path Parameters

- [x] 라우터는 URL에서 path parameter를 식별할 수 있다.
- [ ] 라우터는 URL에서 search parameter를 식별할 수 있다.
