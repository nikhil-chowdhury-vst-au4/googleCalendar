"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeQuotes = void 0;
const escapeQuotes = (string) => {
    if (!string || !string.length)
        return '';
    string = string.replace(/([\\"\\'])/g, '\\' + '$1');
    return string;
};
exports.escapeQuotes = escapeQuotes;
//# sourceMappingURL=escape.quotes.js.map