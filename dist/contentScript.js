/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/content/index.ts ***!
  \******************************/
chrome.runtime.sendMessage("I am loading content script", (response) => {
    console.log(response);
    console.log("I am content script");
});
window.onload = (event) => {
    console.log("The webpage is fully loaded");
};

/******/ })()
;
//# sourceMappingURL=contentScript.js.map