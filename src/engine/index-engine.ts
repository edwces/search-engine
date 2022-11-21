import { HTMLElement, NodeType } from "node-html-parser";
import { client, indexToDB } from "./index-db";

const getTerms = (document: HTMLElement) => {
  const keywords: Record<string, number> = {};
  for (const node of document.childNodes) {
    const text = node.textContent;
    if (node.nodeType !== NodeType.TEXT_NODE && !text) continue;

    const words = text.split(" ");

    for (const word of words) {
      if (!keywords[word]) keywords[word] = 0;
      keywords[word] += 1;
    }
  }
  return keywords;
};

export const index = async (document: HTMLElement, path: string) => {
  const terms = getTerms(document);
  const keyword = Object.keys(terms)[0];
  const index = { name: path, keyword };
};
