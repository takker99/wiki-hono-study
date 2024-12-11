import "../share/print-all-errors.ts";
import { render } from "react-dom";
import { applyMiddleware, bindActionCreators, createStore } from "redux";
import reducer from "./reducer/index.ts";
import middlewares from "./middleware/index.ts";
import * as actions from "./action.ts";
import { App } from "./app.tsx";
import {Line} from "./line.ts";

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

render(<App store={store} />, document.getElementById("app"));

import socket from "./socket/index.ts";
socket({
  store,
  action: bindActionCreators(actions, store.dispatch),
});
