const execa = require('execa')

const {batch, ProgressBar} = require('../util')
const {appendToFile, clearFile, outputToUser} = require('./output')

async function doesPackageExist(packageName) {
  let cmd = `npm search ${packageName}`
  let {stdout} = await execa.command(cmd)
  return !stdout.includes('No matches found')
}

module.exports = async function generateNames({words, batchSize, filePath}) {
  await clearFile(filePath)

  let progressBar = Object.create(ProgressBar).start(words.length)

  let packageAvailability = await batch(words, {
    size: batchSize,
    async processItem(word) {
      // Determine if each word is a viable package name
      let packageExists = await doesPackageExist(word)
      progressBar.update()
      return packageExists ? null : word
    },
    async afterEachBatch(batch) {
      if (!filePath) return

      // Output the results
      let availablePackageNames = batch.filter(word => word)
      let packageNames = availablePackageNames.join('\n') + '\n'
      await appendToFile(filePath, packageNames)
    },
  })

  progressBar.stop()
  return packageAvailability.filter(word => word)
}
