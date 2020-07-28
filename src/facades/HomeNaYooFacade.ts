import { HtmlString, HtmlReader } from "../utilities/HtmlReader"
import { RealestateData } from "../utilities/RealestateDataToCsvWriter"

type RealestateRawData = string[]

class HomeNaYooFacade {
  public static async getRealestateData(url: string) {
    const realestateRawData = await HomeNaYooFacade.fetchRealestateRawData(url)
    const realestateData = HomeNaYooFacade.convertRealestateRawDataToRealestateData(
      realestateRawData
    )

    return realestateData
  }

  private static async fetchRealestateRawData(
    url: string
  ): Promise<RealestateRawData> {
    const projectHtmlString: HtmlString = await HtmlReader.readFromUrl(url)
    const projectDetailDiv: HtmlString = HtmlReader.getSelectedElement(
      projectHtmlString,
      "div.thaitheme_read"
    )
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
