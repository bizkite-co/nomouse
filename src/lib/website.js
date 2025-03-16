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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureScreenshot = captureScreenshot;
exports.fetchPage = fetchPage;
exports.getShortestTitle = getShortestTitle;
exports.processWebsite = processWebsite;
var playwright_1 = require("playwright");
var utils_js_1 = require("./utils.js");
var fs = require("fs/promises");
var data_js_1 = require("./data.js");
function captureScreenshot(url, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch({ headless: true })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, 8, 10]);
                    return [4 /*yield*/, page.goto(url)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.setViewportSize({ width: 1280, height: 720 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.screenshot({ path: outputPath })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 7:
                    error_1 = _a.sent();
                    console.error("Error capturing screenshot for ".concat(url, ":"), error_1);
                    throw error_1;
                case 8: return [4 /*yield*/, browser.close()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function fetchPage(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, html, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    html = _a.sent();
                    return [2 /*return*/, html];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error fetching ".concat(url, ":"), error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getShortestTitle(html) {
    return __awaiter(this, void 0, void 0, function () {
        var cheerio, $, titles, shortestTitle, _i, titles_1, title;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('cheerio'); })];
                case 1:
                    cheerio = _a.sent();
                    $ = cheerio.load(html);
                    titles = [
                        $('meta[property="og:title"]').attr('content'),
                        $('title').text(),
                        $('h1').first().text(),
                    ];
                    shortestTitle = '';
                    for (_i = 0, titles_1 = titles; _i < titles_1.length; _i++) {
                        title = titles_1[_i];
                        if (title && (shortestTitle === '' || title.length < shortestTitle.length)) {
                            shortestTitle = title;
                        }
                    }
                    return [2 /*return*/, shortestTitle];
            }
        });
    });
}
function processWebsite(url, refresh, currentDate) {
    return __awaiter(this, void 0, void 0, function () {
        var normalizedUrl, urlPath, folderPath, filePath, htmlFilePath, html, extractedData, screenshotFilename, screenshotPath, error_3, markdownContent, writeError_1, existingContent, e_1, html, extractedData, screenshotFilename, screenshotPath, error_4, markdownContent, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalizedUrl = (0, utils_js_1.normalizeUrl)(url);
                    urlPath = (0, utils_js_1.generateUrlPath)(url);
                    folderPath = "src/content/websites/".concat(urlPath);
                    filePath = "".concat(folderPath, "/index.md");
                    htmlFilePath = "".concat(folderPath, "/raw.html");
                    if (!refresh) return [3 /*break*/, 13];
                    console.log("Refreshing data for ".concat(url));
                    return [4 /*yield*/, fetchPage(url)];
                case 1:
                    html = _a.sent();
                    if (!html) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, data_js_1.extractData)(html, url, currentDate)];
                case 2:
                    extractedData = _a.sent();
                    if (!extractedData) {
                        console.error("Skipping ".concat(url, " due to missing data."));
                        return [2 /*return*/];
                    }
                    screenshotFilename = "screenshots/".concat(normalizedUrl.replace(/[^a-z0-9]/gi, '_'), ".png");
                    screenshotPath = "public/".concat(screenshotFilename);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, captureScreenshot(url, screenshotPath)];
                case 4:
                    _a.sent();
                    extractedData.desktopSnapshot = screenshotFilename;
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    // Error is already logged in captureScreenshot, but we still continue
                    extractedData.desktopSnapshot = ''; // Set to empty string if capture fails
                    return [3 /*break*/, 6];
                case 6:
                    markdownContent = (0, data_js_1.createMarkdownContent)(extractedData);
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 11, , 12]);
                    return [4 /*yield*/, fs.mkdir(folderPath, { recursive: true })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(filePath, markdownContent, 'utf-8')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(htmlFilePath, html, 'utf-8')];
                case 10:
                    _a.sent();
                    console.log("Successfully wrote to ".concat(filePath, " and ").concat(htmlFilePath));
                    (0, utils_js_1.createRawMarkdown)(folderPath);
                    return [3 /*break*/, 12];
                case 11:
                    writeError_1 = _a.sent();
                    console.error("Error writing to ".concat(filePath, " or ").concat(htmlFilePath, ":"), writeError_1);
                    return [3 /*break*/, 12];
                case 12: return [3 /*break*/, 31];
                case 13:
                    existingContent = null;
                    _a.label = 14;
                case 14:
                    _a.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                case 15:
                    existingContent = _a.sent();
                    return [3 /*break*/, 17];
                case 16:
                    e_1 = _a.sent();
                    return [3 /*break*/, 17];
                case 17:
                    if (!!existingContent) return [3 /*break*/, 30];
                    console.log("Creating new file for ".concat(url));
                    return [4 /*yield*/, fetchPage(url)];
                case 18:
                    html = _a.sent();
                    if (!html) return [3 /*break*/, 29];
                    return [4 /*yield*/, (0, data_js_1.extractData)(html, url, currentDate)];
                case 19:
                    extractedData = _a.sent();
                    if (!extractedData) {
                        console.error("Skipping ".concat(url, " due to missing data."));
                        return [2 /*return*/];
                    }
                    screenshotFilename = "screenshots/".concat(normalizedUrl.replace(/[^a-z0-9]/gi, '_'), ".png");
                    screenshotPath = "public/".concat(screenshotFilename);
                    _a.label = 20;
                case 20:
                    _a.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, captureScreenshot(url, screenshotPath)];
                case 21:
                    _a.sent();
                    extractedData.desktopSnapshot = screenshotFilename;
                    return [3 /*break*/, 23];
                case 22:
                    error_4 = _a.sent();
                    // Error is already logged in captureScreenshot, but we still continue
                    extractedData.desktopSnapshot = ''; // Set to empty string if capture fails
                    return [3 /*break*/, 23];
                case 23:
                    markdownContent = (0, data_js_1.createMarkdownContent)(extractedData);
                    _a.label = 24;
                case 24:
                    _a.trys.push([24, 28, , 29]);
                    return [4 /*yield*/, fs.mkdir(folderPath, { recursive: true })];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(filePath, markdownContent, 'utf-8')];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(htmlFilePath, html, 'utf-8')];
                case 27:
                    _a.sent();
                    console.log("Successfully wrote to ".concat(filePath, " and ").concat(htmlFilePath));
                    (0, utils_js_1.createRawMarkdown)(folderPath);
                    return [3 /*break*/, 29];
                case 28:
                    e_2 = _a.sent();
                    console.error('Error writing file', e_2);
                    return [3 /*break*/, 29];
                case 29: return [3 /*break*/, 31];
                case 30:
                    console.log("Skipping URL: ".concat(url));
                    _a.label = 31;
                case 31: return [2 /*return*/];
            }
        });
    });
}
