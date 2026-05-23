console.log('commonjs module loaded')

let calls = 0

module.exports = {
  kind: 'commonjs',
  nextCall() {
    calls += 1
    return calls
  },
}
