import type { Page } from "@progfay/scrapbox-parser";

export const buildTitle = (
  { wiki, title, lines }: { wiki: string; title: string; lines: Page },
): string => {
  const subtitle = lines.find((line) => line.type === "title")?.text;

  return subtitle ? `${title}: ${subtitle} - ${wiki}` : `${title} - ${wiki}`;
};
