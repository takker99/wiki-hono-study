import shortid from "shortid";

export default class Line{
  constructor(opts){
    this.value = "";
    this.indent = 0;
    this.user = window.user ? window.user.id : null;
    this.id = shortid.generate();
    Object.assign(this, opts);
  }
}
