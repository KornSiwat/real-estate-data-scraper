import * as request from "request-promise"
import * as cheerio from "cheerio"

type HtmlString = string

class HtmlReader {
  public static async readFromUrl(url: string): Promise<HtmlString> {
    const htmlString = await request.get(url)

    return htmlString
  }

  public static filter(
    htmlString: HtmlString,
    selector: string,
    options: CheerioOptionsInterface
  ): HtmlString {
    return cheerio.load(htmlString).html(selector, options)
  }
}

export { HtmlReader }
