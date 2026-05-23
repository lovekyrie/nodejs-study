module.exports = function (humanAction) {
  let random = Math.random() * 3;
  let computerAction;
  if (random < 1) {
    computerAction = 'rock';
  } else if (random > 2) {
    computerAction = 'scissor';
  } else {
    computerAction = 'paper';
  }
  console.log('我出了' + computerAction)

  if (humanAction === computerAction) {
    console.log('平局');
    return 0
  } else if (
    (humanAction === 'rock' && computerAction === 'scissor') ||
    (humanAction === 'scissor' && computerAction === 'paper') ||
    (humanAction === 'paper' && computerAction === 'rock')
  ) {
    console.log('你赢了');
    return -1
  } else {
    console.log('你输了');
    return 1
  }
};