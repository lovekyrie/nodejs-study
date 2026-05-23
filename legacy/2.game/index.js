// const humanAction = process.argv[process.argv.length - 1];

const game = require('./lib')
// const res = game(humanAction)
// console.log(res)

let count = 0
process.stdin.on('data', e=> {
  const humanAction = e.toString().trim()
  // console.log(humanAction)
  const result = game(humanAction)
  if (result === -1 ) {
    count++ 
  }

  if (count === 3) {
    console.log('你太厉害了，我不玩儿了！')
    process.exit()
  }
})