import { HTMLElement, NodeType } from "node-html-parser";
import { client, indexToDB } from "./index-db";

// interface TermResult {
//   term: string;
//   occurance: number;
// }

// const getTerms = (document: HTMLElement) => {
//   const body = document.getElementsByTagName("body");
//   const keywords: TermResult[] = [];
//   for (const node of body) {
//     const text = node.textContent;
//     if (node.nodeType !== NodeType.TEXT_NODE && !text) continue;

//     const words = text.trim().split(" ");

//     for (const word of words) {
//       const found = keywords.find((item) => item.term === word);
//       if (found) found.occurance += 1;
//       else keywords.push({ term: word, occurance: 0 });
//     }
//   }
//   return keywords;
// };

const getMetadata = (document: HTMLElement) => {
  const titleNode = document.querySelector("title");
  const descriptionNode = document.querySelector('meta[name="description"]');

  return {
    title: titleNode && titleNode.innerHTML,
    description: descriptionNode && descriptionNode.getAttribute("content"),
  };
};

export const index = async (document: HTMLElement, url: string) => {
  //const terms = getTerms(document);
  //const popular = terms.find((item) => item.occurance > 4);
  const metadata = getMetadata(document);
  const index = {
    url,
    title: metadata.title,
    description: metadata.description,
  };
  indexToDB(client, index);
};
