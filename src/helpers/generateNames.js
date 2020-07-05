const npmName = require('npm-name')

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
    let namesStillNeededCount = limit - availablePackageNames.length
    let words = await getWords(i)

    // Get the last N elements in the array because we assume
    // that the beginning of the array is the same every time
    // we call to getWords(), and therefore fetching from the
    // beginning would cause the remaining names never to be
    // found.
    words = words.slice(-namesStillNeededCount)

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
