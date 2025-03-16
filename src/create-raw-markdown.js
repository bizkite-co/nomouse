"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_js_1 = require("./lib/utils.js");
var websiteFolderPath = process.argv[2];
if (!websiteFolderPath) {
    console.error('Please provide the website folder path as an argument.');
    process.exit(1);
}
(0, utils_js_1.createRawMarkdown)(websiteFolderPath);
