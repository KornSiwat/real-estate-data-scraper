import { HomeNaYooFacade } from "./facades/HomeNaYooFacade"

async function main() {
  console.log(
    await HomeNaYooFacade.getRealestateData(
      "https://www.homenayoo.com/ashton-chula-silom/"
    )
  )
}

main()
