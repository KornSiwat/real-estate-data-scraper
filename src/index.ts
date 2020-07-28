import { HomeNaYooFacade } from "./facades/HomeNaYooFacade"
import { RealestateDataToCsvWriter } from "./utilities/RealestateDataToCsvWriter"
import { Config } from "./Config"



async function main() {
  const categoryPageBaseUrl = Config.CategoryPageBaseUrl
  const filename = Config.OutputFilename

  const projectUrls = await HomeNaYooFacade.getRealestateUrlsInCategory(
    categoryPageBaseUrl,
    1,
    95
  )

  await RealestateDataToCsvWriter.setFilename(filename)

  let promises = []

  for (let index = 0; index <= projectUrls.length; ++index) {
    const url = projectUrls[index]
    const isUnresolvedPromisesExceed =
      promises.length % Config.MaxRequest === 0

    if (isUnresolvedPromisesExceed) {
      await Promise.all(promises)
      promises = []
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
