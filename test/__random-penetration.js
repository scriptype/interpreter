var Interpreter = require("../src/main")

module.exports = function (totalTestCount, operators) {
    function getRandomNumber () {
        // Pick a random number
        var number = String(Math.floor(Math.random() * 10))

        var integerCount = Math.round(Math.random() * 4)
        while (integerCount-- > 0) {
            number += Math.round(Math.random() * 9)
        }

        // If first character is not 0, make it float by 50% chance
        if (number[0] !== "0") {
            number = (Math.random() < .5) ?
            number + "." :
                number
        }

        // If number is a float, append random digits after dot.
        if (number.match(/\./)) {
            var decimalCount = Math.ceil(Math.random() * 4)
            while (decimalCount-- > 0) {
                number += Math.round(Math.random() * 9)
            }
        }

        return number
    }

    function isNan (x) {
        return toString.call(x) === "[object Number]" &&
                x !== +x
    }

    totalTestCount = totalTestCount || 100
    operators = operators || ["+", "-", "*", "/"]

    var cases = []

    var signs = ["+", "-", ""]

    var testCount = 0

    console.log("TESTING " + totalTestCount + " CASES")

    var start = new Date().getTime()

    while (testCount++ < totalTestCount) {
        var numbers = []
        var value = ""

        var numberCount = Math.ceil(Math.random() * 5)
        while (numberCount-- > 0) {
            numbers.push(getRandomNumber())
        }

        for (var i = 0; i < numbers.length; i++) {
            var operator = operators[Math.floor(Math.random() * operators.length)]
            var sign = signs[Math.floor(Math.random() * signs.length)]
            var startingWhiteSpaceCount = Math.round(Math.random() * 4)
            var trailingWhiteSpaceCount = Math.round(Math.random() * 4)

            while (startingWhiteSpaceCount-- > 0) {
                value += " "
            }

            value += sign ? (" " + sign) : sign
            value += numbers[i]

            while (trailingWhiteSpaceCount-- > 0) {
                value += " "
            }

            if (i < numbers.length - 1) {
                value += operator
            }
        }

        var interpretedValue = "failed"

        try {
            interpretedValue = new Interpreter(value).interpret()
        } catch (e) {
            console.log("error while testing the value:", value, e)
        }
        var evaluatedValue = eval(value)

        var pass = isNan(interpretedValue) && isNan(evaluatedValue) ?
            true :
            interpretedValue === evaluatedValue

        cases.push({
            pass: pass,
            interpreted: interpretedValue,
            evaluated: evaluatedValue,
            value: value
        })
    }

    var end = new Date().getTime()

    var fails = cases.filter(function (testCase) {
        return !testCase.pass
    })

    if (fails.length) {
        console.log(fails)
        console.log("=========")
        console.log("FINISHED: " + (fails.length) + " failed cases out of " + totalTestCount)
    } else {
        console.log("FINISHED: ALL PASSED")
    }

    console.log( ((end - start) / 1000) + " seconds" )

    global.testResults = cases

    return cases
}