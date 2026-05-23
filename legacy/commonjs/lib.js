console.log('hello geekbang')

exports.hello = 'world'

exports.add = function (a, b) {
  return a + b   
}

exports.geekbang = { hello : 'world'}

module.exports = function minis(a,b) {
  return a - b
}

setTimeout(()=>{
  console.log(exports)
},2000)