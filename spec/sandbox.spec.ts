import puppeteer from "puppeteer";

let page: any;
let browser: any;

describe("Sandbox", () => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page
      .goto("https://e2e-boilerplates.github.io/sandbox/", {
        waitUntil: "networkidle0"
      })
      // tslint:disable-next-line:no-empty
      .catch(() => {});
  }, 20000);

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  it("should be on the sandbox", async () => {
    await page.waitFor("h1");
    const title = await page.$eval("h1", (el: { textContent: any }) => {
      return el.textContent;
    });

    expect(await page.title()).toEqual("Sandbox");
    expect(title).toEqual("Sandbox");
  });
});
