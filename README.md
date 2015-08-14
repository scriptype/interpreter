# Interpreter
Side project just for fun.

It's not an interpreter exactly: it'll also evaluate what it has parsed.
And it's only capable of taking numbers and math operators as input.

For further development see `package.json`


## Example usage
```js
var Interpreter = require("./interpreter")
var test = require("./interpreter/test/test")

new Interpreter("3 + 5 * 8 / 16").interpret()
// 5.5
new Interpreter().interpret("10 * -5 * 2 + 2 - -5")
// -93

test.randomPenetration(500)
test.basic("5 + 2 / -8324.21 + +22 * -128")
```
