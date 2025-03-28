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
var promises_1 = require("node:fs/promises");
var sync_1 = require("csv-parse/sync");
var website_js_1 = require("./lib/website.js");
function enrichData() {
    return __awaiter(this, arguments, void 0, function (refresh, targetUrl) {
        var csvData, urls, currentDate, error_1, _i, _a, url, error_2;
        if (refresh === void 0) { refresh = false; }
        if (targetUrl === void 0) { targetUrl = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Running enrichData with refresh = ".concat(refresh, ", targetUrl = ").concat(targetUrl));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, promises_1.default.readFile('src/data/pages.csv', 'utf-8')];
                case 2:
                    csvData = _b.sent();
                    urls = (0, sync_1.parse)(csvData, {
                        skip_empty_lines: true,
                    }).flat();
                    currentDate = new Date().toISOString();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.mkdir('public/screenshots', { recursive: true })];
                case 4:
                    _b.sent(); // Use recursive: true
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    if (error_1.code !== 'EEXIST') {
                        throw error_1;
                    }
                    return [3 /*break*/, 6];
                case 6:
                    _i = 0, _a = (targetUrl ? [targetUrl] : urls);
                    _b.label = 7;
                case 7:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    url = _a[_i];
                    return [4 /*yield*/, (0, website_js_1.processWebsite)(url, refresh, currentDate)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10:
                    console.log('Data enrichment complete.');
                    return [3 /*break*/, 12];
                case 11:
                    error_2 = _b.sent();
                    console.error('Error during enrichment:', error_2);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
// Get refresh flag and optional URL from command line arguments
var refreshFlag = process.argv.includes('--refresh');
var targetUrl = process.argv.find(function (arg) { return arg.startsWith('http'); });
enrichData(refreshFlag, targetUrl !== null && targetUrl !== void 0 ? targetUrl : null);
