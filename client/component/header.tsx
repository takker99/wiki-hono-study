import type { FunctionComponent } from "preact";
import { EditTool } from "./edit-tool.tsx";
import { Login } from "./Login.tsx";
import { Title } from "./Title.tsx";
import { PageDate } from "./PageDate.tsx";
import type { Store } from "../store.ts";

export const Header: FunctionComponent<{ store: Store }> = ({ store }) => (
  <div className="header">
    <div className="toolbar">
      <EditTool store={store} />
      <Login />
      <div className="clear" />
    </div>
    <Title store={store} />
    <PageDate {...store.page} />
  </div>
);
