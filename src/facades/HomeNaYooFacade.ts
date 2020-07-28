import { HtmlString, HtmlReader } from "../utilities/HtmlReader"
import { RealestateData } from "../utilities/RealestateDataToCsvWriter"
import { Config } from "../Config"

type RealestateRawData = string[]
type RealestateUrl = string

class HomeNaYooFacade {
  public static async getRealestateUrlsInCategory(
    baseUrl: string,
    startPage: number,
    endPage: number
  ): Promise<RealestateUrl[]> {
    let realestateUrlsInCategory: string[] = []
    let promises = []

    for (let pageNumber = startPage; pageNumber <= endPage; ++pageNumber) {
      const realestateListPageUrl = `${baseUrl}${pageNumber}`
      const isUnresolvedPromiseExceed = pageNumber % Config.MaxRequest === 0

      if (isUnresolvedPromiseExceed) {
        await Promise.all(promises)
        promises = []
      }

      promises.push(
        HomeNaYooFacade.getRealestateUrlsFromPage(realestateListPageUrl).then(
          (realestateUrl) => {
            realestateUrlsInCategory = realestateUrlsInCategory.concat(
              realestateUrl
            )

            if (realestateUrl === []) {
              console.log(`urls from page ${pageNumber}: fail`)
            } else {
              console.log(`urls from page ${pageNumber}: success`)
            }
          }
        )
      )
    }

    await Promise.all(promises)

    return realestateUrlsInCategory
  }

  public static async getRealestateData(url: string): Promise<RealestateData> {
    const realestateRawData = await HomeNaYooFacade.fetchRealestateRawData(url)
    const realestateData = HomeNaYooFacade.convertRealestateRawDataToRealestateData(
      realestateRawData
    )

    return realestateData
  }

  private static async getRealestateUrlsFromPage(
    url: string
  ): Promise<RealestateUrl[]> {
    const categoryPageHtmlString: HtmlString = await HtmlReader.readFromUrl(url)
    const projectListDiv: HtmlString = HtmlReader.getSelectedElement(
      categoryPageHtmlString,
      "div.tt_list_post"
    )
    const articles = HtmlReader.getSelectedElements(projectListDiv, "article")
    const urls = articles.map((article) => HtmlReader.getUrls(article)[1])

    return urls
  }

  private static async fetchRealestateRawData(
    url: string
  ): Promise<RealestateRawData> {
    const projectHtmlString: HtmlString = await HtmlReader.readFromUrl(url)
    const projectDetailDiv: HtmlString = HtmlReader.getSelectedElement(
      projectHtmlString,
      "div.thaitheme_read"
    )
      .replace(/\n/, " ")
      .match(/(<table)(.*?)(table>)/gs)![0]

    const realestateProjectTableData: string[] = HtmlReader.getSelectedElements(
      projectDetailDiv,
      "tr > td"
    ).map((htmlTableDataString) => HtmlReader.getInnerText(htmlTableDataString))

    return realestateProjectTableData
  }

  private static convertRealestateRawDataToRealestateData(
    data: string[]
  ): RealestateData {
    return data.reduce((accumulate, current, index) => {
      if (this.isOdd(index)) {
        accumulate[data[index - 1]] = current
      }

      return accumulate
    }, {} as RealestateData)
  }

  private static isOdd(n: number): boolean {
    return n % 2 === 1
  }
}

export { HomeNaYooFacade }
