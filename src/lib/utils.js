"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.normalizeUrl = normalizeUrl;
exports.generateFilename = generateFilename;
exports.generateUrlPath = generateUrlPath;
exports.createRawMarkdown = createRawMarkdown;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
var fs = require("fs");
var turndown_1 = require("turndown");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function normalizeUrl(url) {
    return url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
}
function generateFilename(url) {
    var normalized = normalizeUrl(url);
    return normalized.replace(/[^a-z0-9]/gi, '_') + '.png';
}
function generateUrlPath(url) {
    var normalized = normalizeUrl(url);
    return normalized.replace(/[^a-z0-9]/gi, '_');
}
function createRawMarkdown(websiteFolderPath) {
    var htmlFilePath = "".concat(websiteFolderPath, "/raw.html");
    var markdownFilePath = "".concat(websiteFolderPath, "/raw.md");
    try {
        var htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        var turndownService = new turndown_1.default();
        var markdownContent = turndownService.turndown(htmlContent);
        fs.writeFileSync(markdownFilePath, markdownContent, 'utf-8');
    }
    catch (error) {
        console.error("Error processing ".concat(websiteFolderPath, ":"), error);
    }
}
