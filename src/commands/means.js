const chalk = require('chalk')
const dataMuse = require('datamuse')

const generateNames = require('../helpers/generateNames')
const {outputToUser} = require('../helpers/output')

module.exports = async function means(meansLike, args) {
  let limit = Number(args.limit)
  let maxWordLength = Number(args.maxWordLength)
  let filePath = args.write

  let words = await getMeaningfulWords({meansLike, limit, maxWordLength})

  let availablePackageNames = await generateNames({
    words,
    batchSize: Number(args.batchSize),
    filePath,
  })

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
