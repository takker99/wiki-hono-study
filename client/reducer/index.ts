import { combineReducers } from "redux";
import page from "./page.ts";
import pagelist from "./pagelist.ts";
import relatedPagelist from "./related-pagelist.ts";
import socket from "./socket.ts";

export default combineReducers({ page, pagelist, relatedPagelist, socket });
