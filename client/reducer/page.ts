import Line from "../line";
import shortid from "shortid";
import { getBlock } from "../component/syntax/decorator";

const MAX_INDENT = 16;

export default function pageReducer(state = {}, action) {
  switch (action.type) {
    case "route":
      if (action.value.wiki) state.wiki = action.value.wiki;
      if (action.value.title) state.title = action.value.title;
      break;
    case "page":
      state = action.value;
      break;
    case "page:lines":
      if (
        state.wiki !== action.value.wiki || state.title !== action.value.title
      ) break;
      state.lines = action.value.lines;
      break;
    case "updateLine": {
      if (!globalThis.user) break;
      let line = state.lines[state.editline];
      line.value = action.value;
      line.user = globalThis.user.id;
      if (!line.id) line.id = shortid.generate();
      break;
    }
    case "insertMultiLines": {
      let indent = state.lines[state.editline].indent;
      let lines = action.value.map((value) => {
        return new Line({
          value: value.trim(),
          indent: indent + value.match(/^\s*/)[0].length,
        });
      });
      state.lines = [
        ...state.lines.slice(0, state.editline + 1),
        ...lines,
        ...state.lines.slice(state.editline + 1),
      ];
      state.editline += action.value.length;
      break;
    }
    case "insertNewLine":
      if (state.editline > -1) {
        let indent = state.lines[state.editline].indent;
        state.lines = [
          ...state.lines.slice(0, state.editline + 1),
          new Line({ indent }),
          ...state.lines.slice(state.editline + 1, state.lines.length),
        ];
        state.editline += 1;
      }
      break;
    case "removeEmptyLines": {
      let upCount = 0;
      state.lines = state.lines.map((line) => {
        line.value = line.value.trim();
        return line;
      });
      const lines = [];
      for (let i = 0; i < state.lines.length; i++) {
        let line = state.lines[i];
        if (line.value.length < 1) { // empty line
          if (i <= state.editline) upCount += 1;
        } else {
          lines.push(line);
        }
      }
      state.lines = lines;
      if (state.editline) state.editline -= upCount;
      break;
    }
    case "editline":
      state.editline = action.value;
      if (state.editline === 0 && state.lines.length === 0) { // empty page
        state.lines = [new Line()];
      }
      break;
    case "editline:up":
      if (state.editline > 0) state.editline -= 1;
      break;
    case "editline:down":
      if (state.editline < state.lines.length - 1) state.editline += 1;
      break;
    case "swapLine:up":
      if (state.editline > 0) {
        let currentLine = state.lines[state.editline];
        state.lines[state.editline] = state.lines[state.editline - 1];
        state.lines[state.editline - 1] = currentLine;
        state.editline -= 1;
      }
      break;
    case "swapLine:down":
      if (state.editline < state.lines.length - 1) {
        let currentLine = state.lines[state.editline];
        state.lines[state.editline] = state.lines[state.editline + 1];
        state.lines[state.editline + 1] = currentLine;
        state.editline += 1;
      }
      break;
    case "swapBlock:up": {
      let currentBlock = getBlock(state.lines, state.editline);
      let upperBlock;
      for (let i = state.editline - 1; i >= 0; i--) {
        let line = state.lines[i];
        if (line.indent < currentBlock.indent) break;
        if (line.indent === currentBlock.indent) {
          upperBlock = getBlock(state.lines, i);
          break;
        }
      }
      if (!upperBlock) break;
      state.lines = [
        ...state.lines.slice(0, upperBlock.start),
        ...state.lines.slice(currentBlock.start, currentBlock.end + 1),
        ...state.lines.slice(upperBlock.start, upperBlock.end + 1),
        ...state.lines.slice(currentBlock.end + 1, state.lines.length),
      ];
      state.editline = upperBlock.start;
      break;
    }
    case "swapBlock:down": {
      let currentBlock = getBlock(state.lines, state.editline);
      if (
        currentBlock.end + 1 >= state.lines.length ||
        state.lines[currentBlock.end + 1].indent !== currentBlock.indent
      ) break;
      let bottomBlock = getBlock(state.lines, currentBlock.end + 1);
      state.lines = [
        ...state.lines.slice(0, currentBlock.start),
        ...state.lines.slice(bottomBlock.start, bottomBlock.end + 1),
        ...state.lines.slice(currentBlock.start, currentBlock.end + 1),
        ...state.lines.slice(bottomBlock.end + 1, state.lines.length),
      ];
      state.editline += bottomBlock.length;
      break;
    }
    case "indent:decrement": {
      let currentLine = state.lines[state.editline];
      if (currentLine.indent > 0) currentLine.indent -= 1;
      break;
    }
    case "indent:increment": {
      let line = state.lines[state.editline];
      if (line.indent < MAX_INDENT) line.indent += 1;
      break;
    }
    case "indentBlock:decrement":
      if (state.lines[state.editline].indent < 1) break;
      getBlock(state.lines, state.editline, (line) => line.indent--);
      break;
    case "indentBlock:increment":
      if (state.lines[state.editline].indent < MAX_INDENT) {
        getBlock(state.lines, state.editline, (line) => line.indent++);
      }
      break;
    case "page:title:startEdit":
      state.newTitle = state.title;
      break;
    case "page:title:change":
      state.newTitle = action.value;
      break;
    case "page:title:cancelEdit":
    case "page:title:submit":
      state.newTitle = null;
      break;
  }
  return state;
}
