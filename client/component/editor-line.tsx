import type { FunctionComponent, h } from "preact";
import { useCallback } from "preact/hooks";
import { LongPress } from "./LongPress.tsx";
import { Code } from "./code.tsx";
import { CommandLineNode } from "@progfay/scrapbox-parser";
import { ParsedCodeBlockStart, SplitedPage } from "../../splitLines.ts";
import { ParsedCodeBlockBody } from "../../splitLines.ts";

export const EditorLine: FunctionComponent<{
  line: SplitedPage<{}, true>[number];
  compiler: any;
  edit: boolean;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onKeyDown: h.JSX.KeyboardEventHandler<HTMLInputElement>;
  onPaste: (e: ClipboardEvent) => void;
}> = ({
  line,
  compiler,
  edit,
  onStartEdit,
  onChange,
  onKeyDown,
  onPaste,
  key,
}) => {
  if (edit) {
    return (
      <Edit
        key={key}
        line={line}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />
    );
  }
  switch (line.type) {
    case "line":
      return renderLine({ line, onStartEdit });
    case "title":
      return renderTitle({ line, onStartEdit });
    case "table-head":
      return renderTableHead({ line, onStartEdit });
    case "table-body":
      return renderTableBody({ line, onStartEdit });
    case "code-head":
      return <CodeBlockStart line={line} onStartEdit={onStartEdit} />;
    case "code-body":
      return <CodeBlockBody line={line} onStartEdit={onStartEdit} />;
  }
};

const CodeBlockStart: FunctionComponent<
  { line: ParsedCodeBlockStart<{}>; onStartEdit: () => void }
> = (
  { key, line, onStartEdit },
) => {
  const { indent, fileName } = line;
  return (
    <li key={key} style={{ marginLeft: indent * 20 }}>
      <LongPress onLongPress={onStartEdit}>
        <span className="code-block-start">{fileName}</span>
      </LongPress>
    </li>
  );
};
const CodeBlockBody: FunctionComponent<
  { line: ParsedCodeBlockBody<{}>; onStartEdit: () => void }
> = (
  { key, line, onStartEdit },
) => {
  const { indent, text, fileName } = line;
  return (
    <li key={key}>
      <LongPress onLongPress={onStartEdit}>
        <span
          className="code-block"
          style={{
            marginLeft: indent * 20 - 5,
            paddingLeft: (indent - indent) * 20 + 5,
          }}
        >
          <Code lang={fileName}>{text}</Code>
        </span>
      </LongPress>
    </li>
  );
};

const Edit: FunctionComponent<{
  line: SplitedPage<{}, true>[number];
  onChange: (value: string) => void;
  onKeyDown: h.JSX.KeyboardEventHandler<HTMLInputElement>;
  onPaste: (e: ClipboardEvent) => void;
}> = (
  { key, line, onChange, onKeyDown, onPaste },
) => {
  const handleChange = useCallback(
    (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) =>
      onChange(e.currentTarget.value),
    [onChange],
  );
  const stopPropagation = useCallback(
    (e: Event) => e.stopPropagation(),
    [],
  );

  return (
    <li key={key} style={{ marginLeft: line.indent * 20 }}>
      <input
        value={line.raw}
        onChange={handleChange}
        onClick={stopPropagation}
        onKeyDown={onKeyDown}
        onPasteCapture={onPaste}
      />
    </li>
  );
};

const renderCli: FunctionComponent<
  { cli: CommandLineNode; indent: number; onStartEdit: () => void }
> = (
  { key, indent, cli, onStartEdit },
) => (
  <li key={key} style={{ marginLeft: indent * 20 }}>
    <LongPress onLongPress={onStartEdit}>
      <span className="cli">
        <span className="prefix">{cli.prefix}</span> <span>{cli.command}</span>
      </span>
    </LongPress>
  </li>
);
