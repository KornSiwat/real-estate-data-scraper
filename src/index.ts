import { HtmlReader, HtmlString } from "./utilities/HtmlReader"

async function main() {
  const projectUrl =
    "https://www.homenayoo.com/golden-town-phaholyothin-lumlukka/"
  const projectHtmlString: HtmlString = await HtmlReader.readFromUrl(projectUrl)
  const projectDetailDiv: HtmlString = HtmlReader.getSelectedElement(
    projectHtmlString,
    "div.thaitheme_read"
  )
  const realestateProjectTableData: HtmlString[] = HtmlReader.getSelectedElements(
    projectDetailDiv,
    "tr > td"
  ).map((htmlTableDataString) => HtmlReader.getInnerText(htmlTableDataString))

  console.log(realestateProjectTableData)
}

main()
