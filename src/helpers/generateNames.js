const npmName = require('npm-name')
const chalk = require('chalk')

const {batch, ProgressBar} = require('../util')
const {appendToFile, clearFile} = require('./output')

module.exports = async function generateNames({
  getWords,
  limit,
  batchSize,
  filePath,
  filter: filterName,
}) {
  if (filePath) await clearFile(filePath)

  let availablePackageNames = []
  let progressBar = Object.create(ProgressBar).start(limit)

  for (let i = 0; availablePackageNames.length < limit; ++i) {
    let words = await getWords(i)

    // There are no more words to process
    if (!words.length) {
      progressBar.stop()
      console.log(
        chalk.red(`\n\nCould not find ${limit} words matching criteria`),
      )
      break
    }

    let names = await batch(words, {
      size: batchSize,
      async processItem(word) {
        let filter = getFilter(filterName)
        let filtered = await filter(word)

        if (filtered) progressBar.update()
        return filtered
      },
      async afterEachBatch(batch) {
        if (!filePath) return

        // Output the results
        let availableNames = batch.filter(name => name)
        await appendToFile(filePath, availableNames.join('\n') + '\n')
      },
    })

    availablePackageNames = availablePackageNames.concat(
      names.filter(name => name),
    )
  }

  progressBar.stop()
  return availablePackageNames
}

function getFilter(filterName) {
  switch (filterName) {
    case 'npm':
      return npmFilter
    default:
      return word => word
  }
}

async function npmFilter(word) {
  let name = word.replace(/\s/g, '-')
  let isAvailable = await npmName(name)
  return isAvailable ? name : null
}
