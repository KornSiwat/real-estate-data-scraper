import { HomeNaYooFacade } from "./facades/HomeNaYooFacade"
import { RealestateDataToCsvWriter } from "./utilities/RealestateDataToCsvWriter"

async function main() {
  const filename = "./result.csv"
  const projectUrl =
    "https://www.homenayoo.com/golden-town-phaholyothin-lumlukka/"

  await RealestateDataToCsvWriter.setFilename(filename)

  const realestateData = await HomeNaYooFacade.getRealestateData(projectUrl)

  RealestateDataToCsvWriter.write(realestateData)
}

main()
