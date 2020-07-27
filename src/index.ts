import { HtmlReader, HtmlString } from "./utilities/HtmlReader"
import fs from "fs"
import readline from "readline"

type RealestateRawData = string[]
type RealestateData = { [key: string]: string }
type ColumnName = string

async function main() {
  const projectUrl =
    "https://www.homenayoo.com/golden-town-phaholyothin-lumlukka/"

  const filename = "./result.csv"

  try {
    const realestateRawData = await fetchRealestateRawData(projectUrl)
    const realestateData = convertRealestateRawDataToRealestateData(
      realestateRawData
    )

    await writeRealestateDateToCsvFile(realestateData, filename)
  } catch (err) {
    console.log(err)
  }
}

async function fetchRealestateRawData(url: string): Promise<RealestateRawData> {
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

async function writeRealestateDateToCsvFile(
  data: RealestateData,
  filename: string
) {
  let existingColumnNames: ColumnName[]
  const dataColumnNames: ColumnName[] = Object.keys(data)

  if (fs.existsSync(filename)) {
    existingColumnNames = await getColumnNames(filename)
  } else {
    existingColumnNames = []
    await fs.promises.appendFile(filename, "")
  }

  if (
    isExistingColumnNamesNotContainingDataColumnNames(
      existingColumnNames,
      dataColumnNames
    )
  ) {
    addNotExistingColumnNames(existingColumnNames, dataColumnNames)
  }

  await updateColumnNamesInFile(existingColumnNames, filename)

  const csvFormatData = convertRealestateDataToCsvFormat(
    data,
    existingColumnNames
  )

  await fs.promises.appendFile(filename, csvFormatData + "\n")
}

async function updateColumnNamesInFile(
  columnNames: ColumnName[],
  filename: string
) {
  const columnNamesInCsv = columnNames.join(",")
  const data = await fs.promises.readFile(filename, "utf8")
  const result = data.split("\n")

  if (result.length <= 1) {
    await fs.promises.writeFile(filename, columnNamesInCsv + "\n", "utf8")
  } else {
    result[0] = columnNamesInCsv
    await fs.promises.writeFile(filename, result.join("\n"), "utf8")
  }
}

async function getColumnNames(filename: string): Promise<ColumnName[]> {
  const firstLine: string = await getFirstLine(filename)

  return firstLine.split(",")
}

async function getFirstLine(filename: string): Promise<string> {
  const readable = fs.createReadStream(filename)
  const reader = readline.createInterface({ input: readable })
  const line: string = await new Promise((resolve) => {
    reader.on("line", (line) => {
      reader.close()
      resolve(line)
    })
  })
  readable.close()

  return line
}

function convertRealestateDataToCsvFormat(
  data: RealestateData,
  columnNames: ColumnName[]
): string {
  return columnNames.reduce((accumulate, current) => {
    if (data[current] === undefined) {
      const result = accumulate + "-,"

      return result
    }
    const result = accumulate + `${data[current]},`

    return result
  }, "")
}

function convertRealestateRawDataToRealestateData(
  data: string[]
): RealestateData {
  return data.reduce((accumulate, current, index) => {
    if (isOdd(index)) {
      accumulate[data[index - 1]] = current
    }

    return accumulate
  }, {} as RealestateData)
}

function isOdd(n: number): boolean {
  return n % 2 === 1
}

function isExistingColumnNamesNotContainingDataColumnNames(
  existingNames: ColumnName[],
  dataNames: ColumnName[]
): boolean {
  return !dataNames.every((name) => existingNames.includes(name))
}

function addNotExistingColumnNames(
  existingNames: ColumnName[],
  dataNames: ColumnName[]
) {
  dataNames.forEach((name) => {
    if (!existingNames.includes(name)) {
      existingNames.push(name)
    }
  })
}

main()
