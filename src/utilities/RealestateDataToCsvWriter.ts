import fs from "fs"
import readline from "readline"

type RealestateData = { [key: string]: string }
type ColumnName = string

class RealestateDataToCsvWriter {
  private static fileColumnNames: ColumnName[]
  private static filename: string

  public static async setFilename(filename: string) {
    RealestateDataToCsvWriter.filename = filename
    await RealestateDataToCsvWriter.setupFile(filename)
  }

  public static async write(data: RealestateData) {
    const dataColumnNames: ColumnName[] = Object.keys(data)

    await RealestateDataToCsvWriter.updateFileColumnNames(dataColumnNames)

    const dataInCsvFormat = RealestateDataToCsvWriter.convertRealestateDataToCsvFormat(
      data
    )

    await fs.promises.appendFile(
      RealestateDataToCsvWriter.filename,
      dataInCsvFormat + "\n"
    )
  }

  private static async setupFile(filename: string) {
    if (fs.existsSync(filename)) {
      RealestateDataToCsvWriter.fileColumnNames = await RealestateDataToCsvWriter.getColumnNamesFromFile(
        filename
      )
    } else {
      RealestateDataToCsvWriter.fileColumnNames = []
      await fs.promises.appendFile(filename, "")
    }
  }

  private static async updateFileColumnNames(columnNames: ColumnName[]) {
    if (RealestateDataToCsvWriter.isColumnNamesInFile(columnNames)) {
      return
    }

    RealestateDataToCsvWriter.addNotExistingColumnNames(columnNames)

    const filename = RealestateDataToCsvWriter.filename
    const columnNamesInCsvFormat = RealestateDataToCsvWriter.fileColumnNames.join(
      ","
    )
    const existingRawData = await fs.promises.readFile(filename, "utf8")
    const existingData = existingRawData.split("\n")
    const isFileHavingData = existingData.length > 1

    if (!isFileHavingData) {
      await fs.promises.writeFile(
        filename,
        columnNamesInCsvFormat + "\n",
        "utf8"
      )
    } else {
      existingData[0] = columnNamesInCsvFormat
      await fs.promises.writeFile(filename, existingData.join("\n"), "utf8")
    }
  }

  private static async getColumnNamesFromFile(
    filename: string
  ): Promise<ColumnName[]> {
    const firstLine: string = await RealestateDataToCsvWriter.getFirstLine(
      filename
    )

    return firstLine.split(",")
  }

  private static async getFirstLine(filename: string): Promise<string> {
    const readable = fs.createReadStream(filename)
    const reader = readline.createInterface({ input: readable })
    const line: string = await new Promise((resolve) => {
      reader.on("line", (line: string) => {
        reader.close()
        resolve(line)
      })
    })
    readable.close()

    return line
  }

  private static convertRealestateDataToCsvFormat(
    data: RealestateData
  ): string {
    return RealestateDataToCsvWriter.fileColumnNames.reduce(
      (accumulate, current) => {
        if (data[current] === undefined) {
          if (accumulate.length === 0) {
            return accumulate + "-"
          }

          return accumulate + ",-"
        }
        const result = accumulate + `,${data[current].replace(/,/gs, "")}`

        return result
      },
      ""
    )
  }

  private static isColumnNamesInFile(columnNames: ColumnName[]): boolean {
    return columnNames.every((name) =>
      RealestateDataToCsvWriter.fileColumnNames.includes(name)
    )
  }

  private static addNotExistingColumnNames(columnNames: ColumnName[]) {
    columnNames.forEach((name) => {
      if (!RealestateDataToCsvWriter.fileColumnNames.includes(name)) {
        RealestateDataToCsvWriter.fileColumnNames.push(name)
      }
    })
  }
}

export { RealestateDataToCsvWriter, RealestateData }
