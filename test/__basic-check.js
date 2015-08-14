var Interpreter = require("../src/main")

module.exports = function (value) {
    var pass = new Interpreter(value).interpret() === eval(value)
    console.log("basic-check value", "'" + value + "'", ":", pass)
    return pass
}