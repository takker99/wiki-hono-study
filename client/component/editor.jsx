import React from "react";
import {Component, store} from "../store";
import compile from "../syntax";
import EditorLine from "./editorline";
import {clone} from "../../server/src/lib/diffpatch";

export default class Editor extends Component {

  constructor(){
    super();
    this.updateLine = this.updateLine.bind(this);
    this.stopEdit = this.stopEdit.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  mapState(state){
    return {page: state.page, user: state.user};
  }

  render(){
    this.debug("render()");
    const lines = Object.keys(this.state.page.lines).map(i => {
      i = parseInt(i);
      let line = this.state.page.lines[i];
      return (
        <li key={i}>
          <EditorLine
             value={line}
             edit={this.state.page.editline === i}
             onStartEdit={() => this.startEdit(i)}
             onChange={value => this.updateLine(i, value)}
             onKeyDown={e => this.onKeyDown(e)}
             />
        </li>
      );
    });
    return (
      <div className="editor" onClick={this.stopEdit}>
        <h1>editor</h1>
        <ul>{lines}</ul>
      </div>
    );
  }

  startEdit(editline){
    this.debug(`start edit line:${editline}`);
    store.dispatch({type: "editline", value: editline});
  }

  stopEdit(){
    this.debug(`stop edit`);
    store.dispatch({type: "editline", value: null});
  }

  updateLine(linenum, value){
    store.dispatch({type: "updateLine", value, linenum});
  }

  onKeyDown(e){
    this.debug(e.keyCode);
    switch(e.keyCode){
    case 13: // enter
      store.dispatch({type: "insertNewLine"});
      break;
    case 40: // down
      store.dispatch({type: "editline:down"});
      break;
    case 38: // up
      store.dispatch({type: "editline:up"});
      break;
    }
  }

}
