import { render } from "preact";
import { applyMiddleware, bindActionCreators, createStore } from "redux";
import reducer from "./client/reducer/index.ts";
import middlewares from "./client/middleware/index.ts";
import * as actions from "./client/action.ts";
import { App } from "./client/app.tsx";
import { Line } from "./client/line.ts";

const store = createStore(
  reducer,
  {
    page: {
      lines: [new Line()],
      editline: null,
    },
    pagelist: [],
    relatedPagelist: [],
    socket: {
      connecting: false,
    },
  },
  applyMiddleware(...middlewares),
);

render(<App store={store} />, document.getElementById("app")!);

import { use as socket } from "./client/socket/index.ts";
socket({
  store,
  action: bindActionCreators(actions, store.dispatch),
});
