var SPECIAL_CHARS = require("../special-chars")

module.exports = function (numberStr) {
    if (typeof numberStr === "number") {
        return numberStr
    }

    var pureNumberStr = numberStr
        .replace(SPECIAL_CHARS.MINUS, "")
        .replace(SPECIAL_CHARS.PLUS, "")

    return (
        // Check if it's an octal literal
        pureNumberStr[0] === "0" &&
        !pureNumberStr.match(/8/) &&
        !pureNumberStr.match(/9/)
    ) ?
        parseInt(numberStr, 8) :
        Number(numberStr)
}