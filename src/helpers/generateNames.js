const npmName = require('npm-name')

const {batch, ProgressBar} = require('../util')
const {appendToFile, clearFile} = require('./output')

module.exports = async function generateNames({words, batchSize, filePath}) {
  await clearFile(filePath)

  let progressBar = Object.create(ProgressBar).start(words.length)

  let availablePackageNames = await batch(words, {
    size: batchSize,
    async processItem(word) {
      word = word.replace(/\s/g, '-')

      let isAvailable = await npmName(word)
      progressBar.update()
      return isAvailable ? word : null
    },
    async afterEachBatch(batch) {
      if (!filePath) return

      // Output the results
      let availableNames = batch.filter(name => name)
      await appendToFile(filePath, availableNames.join('\n') + '\n')
    },
  }).then(names => names.filter(name => name))

  progressBar.stop()
  return availablePackageNames
}
