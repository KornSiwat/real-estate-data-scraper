"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlReader_1 = require("./utilities/HtmlReader");
var fs_1 = __importDefault(require("fs"));
var readline_1 = __importDefault(require("readline"));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var projectUrl, filename, realestateRawData, realestateData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectUrl = "https://www.homenayoo.com/the-reserve-phahol-pradipat/";
                    filename = "./result.csv";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetchRealestateRawData(projectUrl)];
                case 2:
                    realestateRawData = _a.sent();
                    realestateData = convertRealestateRawDataToRealestateData(realestateRawData);
                    return [4 /*yield*/, writeRealestateDateToCsvFile(realestateData, filename)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function fetchRealestateRawData(url) {
    return __awaiter(this, void 0, void 0, function () {
        var projectHtmlString, projectDetailDiv, realestateProjectTableData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HtmlReader_1.HtmlReader.readFromUrl(url)];
                case 1:
                    projectHtmlString = _a.sent();
                    projectDetailDiv = HtmlReader_1.HtmlReader.getSelectedElement(projectHtmlString, "div.thaitheme_read");
                    realestateProjectTableData = HtmlReader_1.HtmlReader.getSelectedElements(projectDetailDiv, "tr > td").map(function (htmlTableDataString) { return HtmlReader_1.HtmlReader.getInnerText(htmlTableDataString); });
                    return [2 /*return*/, realestateProjectTableData];
            }
        });
    });
}
function convertRealestateRawDataToRealestateData(data) {
    return data.reduce(function (accumulate, current, index) {
        if (isOdd(index)) {
            accumulate[data[index - 1]] = current;
        }
        return accumulate;
    }, {});
}
function writeRealestateDateToCsvFile(data, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var existingColumnNames, dataColumnNames, csvFormatData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataColumnNames = Object.keys(data);
                    if (!fs_1.default.existsSync(filename)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getColumnNames(filename)];
                case 1:
                    existingColumnNames = _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    existingColumnNames = [];
                    return [4 /*yield*/, fs_1.default.promises.appendFile(filename, "")];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (isExistingColumnNamesNotContainingDataColumnNames(existingColumnNames, dataColumnNames)) {
                        addNotExistingColumnNames(existingColumnNames, dataColumnNames);
                    }
                    return [4 /*yield*/, updateColumnNamesInFile(existingColumnNames, filename)];
                case 5:
                    _a.sent();
                    csvFormatData = convertRealestateDataToCsvFormat(data, existingColumnNames);
                    return [4 /*yield*/, fs_1.default.promises.appendFile(filename, csvFormatData + "\n")];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getColumnNames(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var firstLine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFirstLine(filename)];
                case 1:
                    firstLine = _a.sent();
                    return [2 /*return*/, firstLine.split(",")];
            }
        });
    });
}
function getFirstLine(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var readable, reader, line;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readable = fs_1.default.createReadStream(filename);
                    reader = readline_1.default.createInterface({ input: readable });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            reader.on("line", function (line) {
                                reader.close();
                                resolve(line);
                            });
                        })];
                case 1:
                    line = _a.sent();
                    readable.close();
                    return [2 /*return*/, line];
            }
        });
    });
}
function convertRealestateDataToCsvFormat(data, columnNames) {
    return columnNames.reduce(function (accumulate, current) {
        if (data[current] === undefined) {
            var result_1 = accumulate + "-,";
            return result_1;
        }
        var result = accumulate + (data[current] + ",");
        return result;
    }, "");
}
function isOdd(n) {
    return n % 2 === 1;
}
function isExistingColumnNamesNotContainingDataColumnNames(existingNames, dataNames) {
    return !dataNames.every(function (name) { return existingNames.includes(name); });
}
function addNotExistingColumnNames(existingNames, dataNames) {
    dataNames.forEach(function (name) {
        if (!existingNames.includes(name)) {
            existingNames.push(name);
        }
    });
}
function updateColumnNamesInFile(columnNames, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var columnNamesInCsv, data, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    columnNamesInCsv = columnNames.join(",");
                    return [4 /*yield*/, fs_1.default.promises.readFile(filename, "utf8")];
                case 1:
                    data = _a.sent();
                    result = data.split("\n");
                    if (!(result.length <= 1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs_1.default.promises.writeFile(filename, columnNamesInCsv + "\n", "utf8")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    result[0] = columnNamesInCsv;
                    return [4 /*yield*/, fs_1.default.promises.writeFile(filename, result.join("\n"), "utf8")];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
