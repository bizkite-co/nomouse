"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.normalizeUrl = normalizeUrl;
exports.generateFilename = generateFilename;
exports.generateUrlPath = generateUrlPath;
exports.createRawMarkdown = createRawMarkdown;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
var turndown_1 = require("turndown");
var turndown_plugin_gfm_1 = require("turndown-plugin-gfm");
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
function createRawMarkdown(htmlContent) {
    console.log("createRawMarkdown called");
    console.log("Input HTML Content:", htmlContent.substring(0, 500)); // Log first 500 chars
    var turndownService = new turndown_1({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });
    // Use the GFM plugin
    turndownService.use(turndown_plugin_gfm_1.gfm);

    turndownService.addRule('emphasis', {
      filter: ['em', 'i'],
      replacement: function (content) {
        return '*' + content + '*'
      }
    })

    turndownService.remove(['style', 'script']); // Removed div and span
    // turndownService.keep('a');
    var markdownContent = turndownService.turndown(htmlContent);
    console.log("Markdown Content:", markdownContent.substring(0, 500)); // Log first 500 chars of output
    return markdownContent;
}
