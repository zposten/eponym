const chalk = require('chalk')
const dataMuse = require('datamuse')

const generateNames = require('../helpers/generateNames')
const {outputToUser} = require('../helpers/output')
const doesPackageExistOnNpm = require('../helpers/doesPackageExistOnNpm')
const {batch, ProgressBar} = require('../util')

module.exports = async function means(meansLike, args) {
  let limit = Number(args.limit)
  let maxWordLength = Number(args.maxWordLength)
  let filePath = args.write
  let batchSize = Number(args.batchSize)

  let availablePackageNames = []
  let words = await getMeaningfulWords({meansLike, limit, maxWordLength})
  let progressBar = Object.create(ProgressBar).start(limit)

  while (availablePackageNames.length < limit) {
    let names = await batch(words, {
      size: batchSize,
      async processItem(word) {
        let packageExists = await doesPackageExistOnNpm(word)
        if (packageExists) return null

        progressBar.update()
        return word
      },
    }).then(names => names.filter(name => name))

    availablePackageNames = availablePackageNames.concat(names)
  }

  progressBar.stop()
  let packageNames = availablePackageNames.join('\n')
  outputToUser(filePath, packageNames)
}

async function getMeaningfulWords({meansLike, limit, maxWordLength}) {
  const dataMuseMax = 1000

  let validWords = []
  let currentLimit = limit

  while (validWords.length < limit) {
    let querySize = Math.min(dataMuseMax, currentLimit)

    let words = await dataMuse
      .words({ml: meansLike, max: querySize})
      .then(responses => responses.map(res => res.word))

    if (maxWordLength) {
      words = words.filter(word => word.length <= maxWordLength)
    }

    validWords = validWords.concat(words)
    currentLimit -= querySize
  }

  return validWords
}
