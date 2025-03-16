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
exports.extractData = extractData;
exports.createMarkdownContent = createMarkdownContent;
var uuid_1 = require("uuid");
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
function extractData(html, url, currentDate) {
    return __awaiter(this, void 0, void 0, function () {
        var title, cheerio, $, description, favicon, image, keywords, absoluteImage;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, getShortestTitle(html)];
                case 1:
                    title = _f.sent();
                    if (!title) {
                        console.error("Error: Could not extract title for ".concat(url));
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('cheerio'); })];
                case 2:
                    cheerio = _f.sent();
                    $ = cheerio.load(html);
                    description = (_a = $('meta[name="description"]').attr('content')) !== null && _a !== void 0 ? _a : '';
                    favicon = (_c = (_b = $('link[rel="icon"]').attr('href')) !== null && _b !== void 0 ? _b : $('link[rel="shortcut icon"]').attr('href')) !== null && _c !== void 0 ? _c : '';
                    image = (_e = (_d = $('meta[property="og:image"]').attr('content')) !== null && _d !== void 0 ? _d : $('img').first().attr('src')) !== null && _e !== void 0 ? _e : '';
                    keywords = $('meta[name="keywords"]').attr('content');
                    // Handle relative favicon URLs
                    if (favicon && !favicon.startsWith('http')) {
                        favicon = new URL(favicon, url).href;
                    }
                    absoluteImage = '';
                    if (image && !image.startsWith('http')) {
                        absoluteImage = new URL(image, url).href;
                    }
                    else {
                        absoluteImage = image;
                    }
                    return [2 /*return*/, {
                            title: title,
                            description: description,
                            favicon: favicon,
                            image: absoluteImage,
                            url: url,
                            tags: keywords ? keywords.split(',').map(function (keyword) { return keyword.trim(); }) : [],
                            lastReviewAt: currentDate,
                            uuid: (0, uuid_1.v4)(),
                            desktopSnapshot: '',
                        }];
            }
        });
    });
}
function createMarkdownContent(data) {
    return "---\ntitle: \"".concat(data.title.replace(/"/g, '\\"'), "\"\ndescription: \"").concat(data.description.replace(/"/g, '\\"'), "\"\nurl: \"").concat(data.url, "\"\nfavi\ncon: \"").concat(data.favicon, "\"\nimage: \"").concat(data.image, "\"\ntags: [").concat(data.tags.map(function (tag) { return "\"".concat(tag.replace(/"/g, '\\"'), "\""); }).join(', '), "]\nlastReviewAt: \"").concat(data.lastReviewAt, "\"\ndesktopSnapshot: \"").concat(data.desktopSnapshot || '', "\"\nuuid: \"").concat(data.uuid, "\"\n---\n");
}
