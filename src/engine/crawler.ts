import axios from "axios";
import { parse, HTMLElement } from "node-html-parser";
import { SEED_PAGE_URL } from "./constants";
import { client } from "./index-db";
import { index } from "./index-engine";

export class Crawler {
  private url?: string;

  constructor() {}

  /** Sets webpage to crawl
   *  FIX: for now ignores robots.txt and parses all pages
   */
  async goto(domain: string): Promise<void> {
    this.url = `http://${domain}`;
  }

  /**
   * Crawls webpage and all of it's pages
   * by finding them by links in each document
   */
  async process() {
    const parsed: string[] = [];
    let queue: string[] = ["/"];

    while (queue.length) {
      const path = queue.shift()!;
      const response = await axios.get(`${this.url}${path}`);
      let document = parse(response.data);
      parsed.push(path);

      const links = this.getRelativeUrls(document);

      queue.push(...links);

      queue = queue.filter((link) => parsed.indexOf(link) === -1);

      // --------
      // Indexing Engine proccess
      await index(document, `${this.url}${path}`);
      // --------
    }
  }
  /**
   * Gets Metadata from webpage from manifest.json
   */
  async getMetadata() {
    const response = await axios.get(`${this.url}/manifest.json`);
    return response.data;
  }

  /**
   * Find out relative urls in a current page
   */
  getRelativeUrls(document: HTMLElement) {
    const anchors = document.getElementsByTagName("a");
    if (!anchors) return [];

    return anchors
      .map((anchor) => {
        return anchor.getAttribute("href");
      })
      .filter(
        (link) => link && !link.startsWith("//") && link.startsWith("/")
      ) as string[];
  }
}
const bootstrap = async () => {
  client
    .connect()
    .then(() => {
      const crawler = new Crawler();
      crawler.goto(SEED_PAGE_URL);
      crawler.process();
    })
    .catch((err) => console.log(`[DB]: error connecting to db: ${err}`));
};

process.on("SIGINT", async () => {
  client.end();
  console.log("[DB]: connection closed");
});

bootstrap();
