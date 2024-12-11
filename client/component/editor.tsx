import StoreComponent from "./store-component.tsx";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useDispatch, useSelector } from "react-redux";
import { createCompiler } from "./syntax/markup.ts";
import { decorateLines } from "./syntax/decorator.ts";
import { EditorLine } from "./editor-line.tsx";
import {
  editlineDown,
  editlineUp,
  indentBlockDecrement,
  indentBlockIncrement,
  indentDecrement,
  indentIncrement,
  insertMultiLines,
  insertNewLine,
  setEditline,
  swapBlockDown,
  swapBlockUp,
  swapLineDown,
  swapLineUp,
  unsetEditline,
  updateLine,
} from "../action.ts";

export const Editor = () => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page);
  const [compiler, setCompiler] = useState(
    createCompiler({ action: dispatch, state: { page } }),
  );

  useEffect(() => {
    setCompiler(createCompiler({ action: dispatch, state: { page } }));
  }, [dispatch, page]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 27: // escape
        dispatch(unsetEditline());
        break;
      case 13: // enter
        dispatch(insertNewLine());
        break;
      case 40: // down
        if (e.ctrlKey) dispatch(swapLineDown());
        else if (e.shiftKey) dispatch(swapBlockDown());
        else dispatch(editlineDown());
        break;
      case 38: // up
        if (e.ctrlKey) dispatch(swapLineUp());
        else if (e.shiftKey) dispatch(swapBlockUp());
        else dispatch(editlineUp());
        break;
      case 78: // ctrl + N
        if (e.ctrlKey) dispatch(editlineDown());
        break;
      case 80: // ctrl + P
        if (e.ctrlKey) dispatch(editlineUp());
        break;
      case 37: // left
        if (e.ctrlKey) dispatch(indentDecrement());
        else if (e.shiftKey) dispatch(indentBlockDecrement());
        break;
      case 39: // right
        if (e.ctrlKey) dispatch(indentIncrement());
        else if (e.shiftKey) dispatch(indentBlockIncrement());
        break;
      case 32: // space
        if (
          e.target.selectionStart !== 0 ||
          e.target.selectionEnd !== 0
        ) break;
        e.preventDefault();
        dispatch(indentIncrement());
        break;
      case 8: // backspace
        if (
          e.target.selectionStart !== 0 ||
          e.target.selectionEnd !== 0
        ) break;
        e.preventDefault();
        dispatch(indentDecrement());
        break;
    }
  }, [dispatch]);

  const onPaste = useCallback((e: ClipboardEvent) => {
    const lines = e.clipboardData?.getData?.("Text")?.split?.(/[\r\n]/);
    if ((lines?.length ?? 0) < 2) return;
    e.preventDefault();
    dispatch(insertMultiLines(lines));
  }, [dispatch]);

  return (
    <div className="editor">
      <ul>
        {page.lines.length < 1 && !page.editline
          ? (
            <EditorLine
              key={0}
              compiler={compiler}
              line={{ value: "(empty)" }}
              onStartEdit={() => dispatch(setEditline(0))}
            />
          )
          : decorateLines(page.lines).map((line, i) => (
            <EditorLine
              key={i}
              compiler={compiler}
              line={line}
              edit={page.editline === i}
              onStartEdit={() => dispatch(setEditline(i))}
              onChange={(newLine) => dispatch(updateLine(newLine))}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
            />
          ))}
      </ul>
    </div>
  );
};
