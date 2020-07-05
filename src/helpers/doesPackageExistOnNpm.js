const execa = require('execa')

module.exports = async function doesPackageExistOnNpm(packageName) {
  let cmd = `npm search ${packageName}`
  let {stdout} = await execa.command(cmd)
  return !stdout.includes('No matches found')
}
