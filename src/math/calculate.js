var parseNumber = require("./parse-number")

module.exports = function calculate (expr) {
    function lookFor(_expr, operators) {
        var operatorList = Object.keys(operators)
        for (var i = 0; i < _expr.length; i++) {
            var foundOperator = (function (index) {
                return operatorList.filter(function (operator) {
                    return operator === _expr[index]
                })[0]
            })(i)

            if (foundOperator) {
                var fn = operators[foundOperator]
                var leftSide = _expr.slice(0, i - 1)
                var rightSide = _expr.slice(i + 2)
                var leftHandSideNumber = parseNumber(_expr[i - 1])
                var rightHandSideNumber = parseNumber(_expr[i + 1])

                _expr = leftSide
                    .concat(fn(leftHandSideNumber, rightHandSideNumber))
                    .concat(rightSide)

                i -= 1
            }
        }
        return _expr
    }

    if (expr.length === 1) {
        return parseNumber(expr[0])
    }

    var multipliedAndDivided = lookFor(expr, {
        "MULTIPLY": function (a, b) {
            return a * b
        },
        "DIVIDE": function (a, b) {
            return a / b
        }
    })

    var addedAndSubtracted = lookFor(multipliedAndDivided, {
        "PLUS": function (a, b) {
            return a + b
        },
        "MINUS": function (a, b) {
            return a - b
        }
    })

    return addedAndSubtracted[0]
}


//var SPECIAL_CHARS = require("../special-chars")
//var arr = ["5", "*", "(", "2", "+", "10", ")", "/", "5", "+", "(", "3", "-", "1", ")", "+", "7"]
//var OPIndex = Infinity
//arr.forEach(function (char, i) {
//    if ( char.match(/\(/) && i < OPIndex ) {
//        OPIndex = i
//    }
//})
//var CPIndex = Infinity
//var CP = ""
//arr.forEach(function (char, i) {
//    if ( char.match(/\)/) && i < CPIndex ) {
//        CPIndex = i
//    }
//})
//if (OPIndex !== Infinity) {
//    console.log(arr.slice(
//        OPIndex + 1,
//        CPIndex
//    ))
//}
//
//var OPEN_PARAN = expr.match(SPECIAL_CHARS["OPEN_PARAN"])
//var CLOSE_PARAN = expr.match(SPECIAL_CHARS["CLOSE_PARAN"])
//var indexOfInnerExpression = expr.indexOf(OPEN_PARAN)
//if (indexOfInnerExpression !== -1) {
//    return calculate(
//        expr.slice(
//            indexOfInnerExpression - 1,
//            expr.lastIndexOf(CLOSE_PARAN)
//        )
//    )
//}