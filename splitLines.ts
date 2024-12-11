import {
  type Line,
  type Node,
  parse,
  type Title,
} from "@progfay/scrapbox-parser";
export type ParsedTitle<L extends { text: string }> =
  & Omit<L, "text">
  & Title
  & {
    indent: 0;
    raw: string;
  };
export type ParsedLine<L extends { text: string }> = Omit<L, "text"> & Line & {
  raw: string;
};

export type ParsedTableHeader<L extends { text: string }> =
  & Omit<L, "text">
  & {
    type: "table-head";
    indent: number;
    fileName: string;
    raw: string;
  };

export type ParsedTableBody<L extends { text: string }> =
  & Omit<L, "text">
  & {
    type: "table-body";
    indent: number;
    fileName: string;
    row: Node[][];
    raw: string;
  };
export type ParsedCodeBlockStart<L extends { text: string }> =
  & Omit<L, "text">
  & {
    type: "code-head";
    indent: number;
    fileName: string;
    raw: string;
  };
export type ParsedCodeBlockBody<L extends { text: string }> =
  & Omit<L, "text">
  & {
    type: "code-body";
    indent: number;
    fileName: string;
    text: string;
    raw: string;
  };
export interface SplitLinesOptions<HasTitle extends boolean> {
  hasTitle?: HasTitle;
}
export type SplitedPage<L extends { text: string }, HasTitle extends boolean> =
  HasTitle extends true ? (
      | ParsedTitle<L>
      | ParsedLine<L>
      | ParsedTableHeader<L>
      | ParsedTableBody<L>
      | ParsedCodeBlockStart<L>
      | ParsedCodeBlockBody<L>
    )[]
    : (
      | ParsedLine<L>
      | ParsedTableHeader<L>
      | ParsedTableBody<L>
      | ParsedCodeBlockStart<L>
      | ParsedCodeBlockBody<L>
    )[];
export const splitLines = <
  L extends { text: string },
  HasTitle extends boolean = true,
>(
  lines: L[],
  options?: SplitLinesOptions<HasTitle>,
): SplitedPage<L, HasTitle> => {
  let input = "";
  const metadata = lines.map((line) => {
    const { text, ...metadata } = line;
    input = [input, text].join("\n");
    return metadata;
  });
  let counter = 0;
  return parse(input, { hasTitle: options?.hasTitle }).flatMap(
    (block): SplitedPage<L, true> => {
      switch (block.type) {
        case "title":
        case "line":
          return [
            {
              ...metadata[counter++],
              ...block,
              indent: 0,
              raw: lines[counter - 1].text,
            } satisfies ParsedTitle<L> | ParsedLine<L>,
          ];
        case "codeBlock": {
          const start = counter;
          counter += block.content.split("\n").length + 1;
          return [
            {
              ...metadata[start],
              ...block,
              type: "code-head",
              raw: lines[start].text,
            } satisfies ParsedCodeBlockStart<L>,
            ...block.content.split("\n").map((content, i) => ({
              ...metadata[start + i + 1],
              ...block,
              type: "code-body",
              text: content,
              raw: lines[start + i + 1].text,
            } satisfies ParsedCodeBlockBody<L>)),
          ];
        }
        case "table": {
          const start = counter;
          counter += block.cells.length + 1;
          return [
            {
              ...metadata[start],
              ...block,
              type: "table-head",
              raw: lines[start].text,
            } satisfies ParsedTableHeader<L>,
            ...block.cells.map((row, i) => ({
              ...metadata[start + i + 1],
              ...block,
              type: "table-body",
              row,
              raw: lines[start + i + 1].text,
            } satisfies ParsedTableBody<L>)),
          ];
        }
      }
    },
  ) as SplitedPage<L, HasTitle>;
};
