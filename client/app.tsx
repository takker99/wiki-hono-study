import { Header } from "./component/header.tsx";
import { Editor } from "./component/editor.tsx";
import PageListContainer from "./component/PageListContainer.tsx";
import { SocketStatus } from "./component/socket-status.tsx";

import type { FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";
import { useDispatch } from "react-redux";
import { cancelTitleEdit, unsetEditline } from "./action.ts";
import { Store } from "./store.ts";

export const App: FunctionComponent<{ store: Store }> = ({ store }) => {
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(unsetEditline());
    dispatch(cancelTitleEdit());
  }, [dispatch]);

  return (
    <div className="app" onClick={onClick}>
      <div className="main">
        <Header store={store} />
        <Editor store={store} />
        <PageListContainer store={store} />
        <SocketStatus connecting={store.socket.connecting} />
        <div className="footer" />
      </div>
    </div>
  );
};
