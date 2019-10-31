import puppeteer from "puppeteer";

let page: any;
let browser: any;
const searchBox = ".gLFyf.gsfi";

describe("google search", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await Promise.race([
      page
        .goto("https://www.google.com", { waitUntil: "networkidle0" })
        .catch(() => {
          throw new Error("Error");
        }),
      page.waitFor("body", { timeout: 6000 }).catch(() => {
        throw new Error("Error");
      })
    ]);
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  it("should be on google search page", async () => {
    await page.waitFor(searchBox);

    const title = await page.title();
    expect(title).toEqual("Google");
  });

  it("should search for Cheese!", async () => {
    expect(!!(await page.$(searchBox))).toBe(true);

    await page.type(searchBox, "Cheese!", { delay: 100 });
    await page.keyboard.press("\n");
  });

  it('the page title should start with "Cheese!', async () => {
    await page.waitFor("#resultStats");

    const title = await page.title();
    const words = title.split(" ");
    expect(words[0]).toEqual("Cheese!");
  });
});
