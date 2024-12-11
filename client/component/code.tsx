import { common, createLowlight } from "lowlight";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
import type { FunctionComponent } from "preact";

const lowlight = createLowlight(common);

export const Code: FunctionComponent<{ lang: string; children: string }> = (
  { lang, children },
) =>
  toJsxRuntime(lowlight.highlight(children, lang), {
    Fragment,
    jsx,
    jsxs,
    elementAttributeNameCase: "html",
  });
