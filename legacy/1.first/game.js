// console.log(process.argv)
const humanAction = process.argv[process.argv.length-1]

let random = Math.random() * 3
let computerAction;
if (random < 1) {
  computerAction = 'rock'
} else if (random > 2) {
  computerAction = 'scissor'
} else {
  computerAction = 'paper'
}
// console.log(random, computerAction)

if (humanAction === computerAction) {
  console.log('平局')
} else if(
  (humanAction === 'rock' && computerAction === 'scissor') || 
  (humanAction === 'scissor' && computerAction === 'paper') ||
  (humanAction === 'paper' && computerAction === 'rock')
) {
  console.log('你赢了')
} else {
  console.log('你输了')
}