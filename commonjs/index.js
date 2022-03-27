console.log('require before')
var lib = require('./lib')
console.log(lib)
console.log('require after')

lib.minus(3-1)

lib.additional = 'test'