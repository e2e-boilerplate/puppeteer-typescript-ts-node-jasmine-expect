import isCI from "is-ci";
import puppeteer from "puppeteer";

let page: any;
let browser: any;
const searchBox: string = ".gLFyf.gsfi";
let originalTimeout: number;

describe("google search", () => {
  beforeAll(async () => {
    browser = isCI
      ? await puppeteer.launch({ headless: true })
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page
      .goto("https://www.google.com", { waitUntil: "networkidle0" })
      .catch(() => {
        throw new Error("Error");
      });
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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
