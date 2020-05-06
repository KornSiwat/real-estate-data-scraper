import { HtmlReader } from "./utilities/HtmlReader"

async function main() {
  const data = await HtmlReader.readFromUrl(
    "https://www.homenayoo.com/golden-town-phaholyothin-lumlukka/"
  )
  const realestateProjectDiv = HtmlReader.filter(data, "div.thaitheme_read", {
    decodeEntities: true,
  })
  const realestateProjectTable = HtmlReader.filter(realestateProjectDiv, "td", {
    decodeEntities: true,
  })

  console.log(realestateProjectTable)
}

main()
