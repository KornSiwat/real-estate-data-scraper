import * as request from "request-promise"
import * as cheerio from "cheerio"

type HtmlString = string
type Url = string

class HtmlReader {
  private static cheerioOption = {
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

    return HtmlReader.replaceNewLineWithSpace(result)
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

  public static getInnerText(str: HtmlString): string {
    return HtmlReader.replaceNewLineWithComma(HtmlReader.removeTag(str))
  }

  public static getUrl(str: HtmlString): Url {
    const result = str.match(/href="(.*?)"/)

    if (result === null) {
      return ""
    }

    return result[1]
  }

  public static getValueInTable(str: HtmlString): HtmlString {
    return str.match(/(<table)(.*?)(table>)/gs)![0]
  }

  private static removeTag(str: HtmlString): HtmlString {
    return str.replace(/(<)(.*?)(>)/gs, "")
  }

  private static replaceNewLineWithSpace(str: HtmlString): HtmlString {
    return str.replace(/\n/, " ")
  }

  private static replaceNewLineWithComma(str: HtmlString): HtmlString {
    return str.trim().replace(/(\n+)/gs, ", ")
  }
}

export { HtmlReader, HtmlString }
