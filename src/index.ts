import { HomeNaYooFacade } from "./facades/HomeNaYooFacade"
import { RealestateDataToCsvWriter } from "./utilities/RealestateDataToCsvWriter"

const maxRequestCount = 300

async function main() {
  const baseCategoryPageUrl = "https://www.homenayoo.com/category/condo/%E0%B8%A3%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%A7-%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%94/page/"
  const filename = "./result.csv"

  const projectUrls = await HomeNaYooFacade.getRealestateUrlsInCategory(
    baseCategoryPageUrl,
    1,
    95
  )

  await RealestateDataToCsvWriter.setFilename(filename)

  const promises = []

  for (let index = 0; index <= projectUrls.length; ++index) {
    const url = projectUrls[index]

    if (promises.length % maxRequestCount === 0) {
      await Promise.all(promises)
    }

    promises.push(getRealestateDataAndWrite(url))
  }

  await Promise.all(promises)
}

async function getRealestateDataAndWrite(url: string) {
  try {
    const realestateData = await HomeNaYooFacade.getRealestateData(url)

    RealestateDataToCsvWriter.write(realestateData)

    console.log(`${url}: success`)
  } catch (err) {
    console.log(`${url}: fail`)
  }
}

main()
