import type { FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

import LongPress from "./longpress.tsx";
import UserIcon from "./usericon.tsx";
import {Code, getFullLanguage } from "./code.tsx";

import { findDOMNode } from "react-dom";
import classnames from "classnames";

export const EditorLine: FunctionComponent<{
  line: any;
  compiler: any;
  edit: any;
  onStartEdit: any;
  onChange: any;
  onKeyDown: any;
  onPaste: any;
  key: any;
}>= ({
  line,
  compiler,
  edit,
  onStartEdit,
  onChange,
  onKeyDown,
  onPaste,
  key,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (edit) {
      findDOMNode(inputRef.current).focus();
    }
  }, [edit]);

  const renderEdit = () => {
    let input = (
      <input
        ref={inputRef}
        value={line.value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        onPasteCapture={onPaste}
      />
    );
    if (line.blocktitle && !line.codeblock && !line.cli) {
      input = <h3>{input}</h3>;
    }
    return <li key={key} style={{ marginLeft: line.indent * 20 }}>{input}</li>;
  };

  const renderCodeBlock = () => {
    const { lang, start, filename, indent } = line.codeblock;
    if (start) {
      return (
        <li key={key} style={{ marginLeft: line.indent * 20 }}>
          <LongPress onLongPress={onStartEdit}>
            <span className="codeblock-start">
              {filename || getFullLanguage(lang) || lang}
            </span>
          </LongPress>
        </li>
      );
    } else {
      let className = classnames({
        codeblock: !line.codeblock.end,
        "codeblock-end": line.codeblock.end,
      });
      return (
        <li key={key}>
          <LongPress onLongPress={onStartEdit}>
            <span
              className={className}
              style={{
                marginLeft: indent * 20 - 5,
                paddingLeft: (line.indent - indent) * 20 + 5,
              }}
            >
              <Code lang={lang}>{line.value}</Code>
            </span>
          </LongPress>
        </li>
      );
    }
  };

  const renderCli = () => {
    return (
      <li key={key} style={{ marginLeft: line.indent * 20 }}>
        <LongPress onLongPress={onStartEdit}>
          <span className="cli">
            <span className="prefix">{line.cli.prefix}</span>{" "}
            <span>{line.cli.command}</span>
          </span>
        </LongPress>
      </li>
    );
  };

  const renderDefault = () => {
    const icon = line.showUserIcon ? <UserIcon id={line.user} size={20} /> : null;
    let value = line.value;
    if (line.numberList) value = line.numberList.prefix + value;
    let elm = (
      <span>
        <LongPress onLongPress={onStartEdit}>
          {compiler(value)}
        </LongPress>
        {icon}
      </span>
    );
    if (line.blocktitle) elm = <h3>{elm}</h3>;
    return (
      <li key={key} style={{ marginLeft: line.indent * 20 }}>
        {elm}
      </li>
    );
  };

  if (edit) return renderEdit();
  if (line.codeblock) return renderCodeBlock();
  if (line.cli) return renderCli();
  return renderDefault();
};