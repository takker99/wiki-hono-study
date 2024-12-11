import shortid from "shortid";
import hasDom from "has-dom";

export class Line {
  constructor(opts) {
    this.value = "";
    this.indent = 0;
    this.user = hasDom() && globalThis.user ? globalThis.user.id : null;
    this.id = shortid.generate();
    Object.assign(this, opts);
  }
}
