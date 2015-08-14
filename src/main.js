var Token = require("./Token")
var SPECIAL_CHARS = require("./special-chars")
var calculate = require("./math/calculate")

function Interpreter (input, debugMode) {
    this.DEBUG_MODE = debugMode || false
    this.input = input || ""
    this.currentToken = null

    return this
}

Interpreter.prototype.getNextToken = function () {
    var char = this.input[this.pos]

    if (this.pos > this.input.length - 1) {
        return new Token("EOF")
    }

    for (var KEY in SPECIAL_CHARS) {
        if (SPECIAL_CHARS.hasOwnProperty(KEY)) {
            if (SPECIAL_CHARS[KEY].test(char)) {
                this.pos += 1
                return new Token(KEY, char)
            }
        }
    }

    throw new TypeError("Interpreter:No matched type of input: " + char)
}

Interpreter.prototype.eat = function (type) {
    if (this.currentToken.type === type) {
        this.currentToken = this.getNextToken()
    } else {
        throw new TypeError(
            "Interpreter:Types don't match in eat(): " + this.currentToken.type + " " + type
        )
    }
}
Interpreter.prototype.analyzeTokens = function () {
    var encounteredNumber = false
    var encounteredWhiteSpace = false
    var wasLastTokenNumber = false
    var wasLastTokenPoint = false
    var chunk = ""
    var tokenValue, tokenType

    while (true) {
        tokenValue = this.currentToken.value
        tokenType = this.currentToken.type
        this.DEBUG_MODE && console.log(tokenValue, tokenType)

        if (tokenType === "NUMBER") {
            chunk += tokenValue
            this.eat("NUMBER")
            encounteredNumber = true
            wasLastTokenNumber = true
            wasLastTokenPoint = false

        } else if (tokenType === "POINT") {

            if (encounteredNumber && !wasLastTokenNumber) {
                throw new SyntaxError("Interpreter:Unexpected Number")
            }

            chunk += tokenValue
            this.eat("POINT")
            wasLastTokenPoint = true
            wasLastTokenNumber = false

        } else if (tokenType === "MINUS" && !encounteredNumber) {
            chunk += tokenValue
            this.eat("MINUS")
            wasLastTokenNumber = false
            wasLastTokenPoint = false

        } else if (tokenType === "PLUS" && !encounteredNumber) {
            chunk += tokenValue
            this.eat("PLUS")
            wasLastTokenNumber = false
            wasLastTokenPoint = false

        } else if (tokenType === "WHITE_SPACE") {
            this.eat("WHITE_SPACE")
            encounteredWhiteSpace = true
            wasLastTokenNumber = false
            wasLastTokenPoint = false

        } else {
            return chunk
        }
    }
}

Interpreter.prototype.getExpressionOrKeyword = function () {
    // Get leftHandSide
    var leftHandSide = this.analyzeTokens()
    var tokenType = this.currentToken.type

    if (tokenType !== "EOF") {

        if (tokenType === "PLUS" ||
            tokenType === "MINUS" ||
            tokenType === "DIVIDE" ||
            tokenType === "MULTIPLY"
        ) {
            this.eat(tokenType)
            return {
                end: false,
                value: [leftHandSide, tokenType]
            }

        } else {
            throw new SyntaxError("Interpreter:Unidentified operator:" + tokenType)
        }

    } else {
        return {
            end: true,
            value: [leftHandSide]
        }
    }
}

Interpreter.prototype.evaluate = function (expr) {
    // HARDCODED: Evaluate only math logic
    return calculate(expr)
}

Interpreter.prototype.interpret = function (input, debugMode) {
    this.input = typeof input !== "undefined" ? input : this.input
    this.DEBUG_MODE = typeof debugMode !== "undefined" ? debugMode : this.DEBUG_MODE
    this.pos = 0

    try {
        // Kick off
        this.currentToken = this.getNextToken()

        var results = []
        while (true) {
            var expression = this.getExpressionOrKeyword()
            results.push.apply(results, expression.value)
            if (expression.end) {
                break
            }
        }

        this.DEBUG_MODE && console.log(results)
        return results.length && this.evaluate(results)

    } catch (e) {
        throw e
    }
}

global.Interpreter = Interpreter
module.exports = Interpreter