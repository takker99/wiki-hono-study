import SocketIO from "socket.io-client";
import { defaultRoute, parseRoute } from "../../share/route.ts";
import page from "./page.ts";
import pagelist from "./pagelist.ts";
import title from "./title.ts";

export const io = SocketIO();

export const use = ({ store, action }) => {
  io.on("connect", () => {
    store.dispatch({ type: "socket:connect" });
  });

  io.on("disconnect", () => {
    store.dispatch({ type: "socket:disconnect" });
  });

  io.on("reconnect", () => {
    location.reload();
  });

  page({ io, store, action });
  pagelist({ io, store, action });
  title({ io, store, action });

  let popStateTimeout: number | undefined;
  globalThis.addEventListener("popstate", () => {
    clearTimeout(popStateTimeout);
    popStateTimeout = setTimeout(() => {
      action.noPushStateRoute(Object.assign({}, defaultRoute, parseRoute()));
    }, 500);
  }, false);

  io.on("connect", () => {
    action.route(Object.assign({}, defaultRoute, parseRoute()));
  });
};
