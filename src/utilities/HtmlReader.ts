import * as request from "request-promise"
import * as cheerio from "cheerio"

type HtmlString = string

class HtmlReader {
  public static cheerioOption = {
    decodeEntities: false,
  }

  public static async readFromUrl(url: string): Promise<HtmlString> {
    return await request.get(url)
  }

  public static getSelectedElement(
    str: HtmlString,
    selector: string,
    options: CheerioOptionsInterface = HtmlReader.cheerioOption
  ): HtmlString {
    const result = cheerio.load(str, options)(selector).html()!

    return result
  }

  public static getSelectedElements(
    str: HtmlString,
    selector: string,
    options: CheerioOptionsInterface = HtmlReader.cheerioOption
  ): HtmlString[] {
    return cheerio
      .load(
        str,
        options
      )(selector)
      .toArray()
      .map((elem) => cheerio.html(elem, options))
  }

  public static getInnerText(str: HtmlString) {
    return HtmlReader.removeNewLine(HtmlReader.removeTag(str))
  }

  private static removeTag(str: HtmlString) {
    return str.replace(/(<)(.*?)(>)/gs, "")
  }

  private static removeNewLine(str: HtmlString) {
    return str.replace(/\n/g, ",")
  }
}

export { HtmlReader, HtmlString }
