const glob = require('glob')

// 同步加载（阻塞I/O)方式
// var result = null
// console.time('glob')
// result = glob.sync(__dirname + '/**/*')
// console.timeEnd('glob')
// console.log(result)

// 异步加载 (非阻塞I/O)方式
var result = null
console.time('glob')
glob(__dirname + '/**/*', function(err, res) {
  result = res
  // console.log(result)
  console.log('got result')
})
console.timeEnd('glob')
console.log(1+1)