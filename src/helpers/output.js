const path = require('path')
const fs = require('fs-extra')
const table = require('text-table')

const {chunk} = require('../util')

function getOutputPath(filePath) {
  if (!filePath) return null

  return path.isAbsolute(filePath)
    ? filePath
    : typeof filePath === 'string'
    ? path.resolve(process.cwd(), filePath)
    : null
}

async function clearFile(filePath) {
  let outputPath = getOutputPath(filePath)
  if (!outputPath) return
  await fs.outputFile(outputPath, '')
}

async function appendToFile(filePath, packageNames) {
  return await fs.appendFile(getOutputPath(filePath), packageNames)
}

function outputToUser(filePath, packageNames) {
  let outputPath = getOutputPath(filePath)

  if (outputPath) {
    console.log(
      `\nWrote ${packageNames.length} available package names${
        outputPath ? ' to ' + outputPath : ''
      }`,
    )
  } else {
    let columnCount = 3
    let chunked = chunk(packageNames, columnCount)
    console.log('\n' + table(chunked))
  }
}

module.exports = {
  getOutputPath,
  appendToFile,
  clearFile,
  outputToUser,
}
