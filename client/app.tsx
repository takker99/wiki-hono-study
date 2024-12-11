import StoreComponent from "./component/store-component.tsx";
import Header from "./component/header.tsx";
import Editor from "./component/editor.tsx";
import PageListContainer from "./container/pagelist.tsx";
import SocketStatus from "./component/socket-status.tsx";

export class App extends StoreComponent {
  mapState() {
    return {};
  }

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    this.action.unsetEditline();
    this.action.cancelTitleEdit();
  }

  render() {
    debug("render()");
    const { store } = this.props;
    const socketStatus = hasDom() ? <SocketStatus store={store} /> : null;
    return (
      <div className="app" onClick={this.onClick}>
        <div className="main">
          <Header store={store} />
          <Editor store={store} />
          <PageListContainer store={store} />
          {socketStatus}
          <div className="footer" />
        </div>
      </div>
    );
  }
}
