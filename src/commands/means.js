const dataMuse = require('datamuse')

const {outputToUser} = require('../helpers/output')
const generateNames = require('../helpers/generateNames')

module.exports = async function means(meansLike, args) {
  let limit = Number(args.limit)
  let maxWordLength = Number(args.maxWordLength)
  let batchSize = Number(args.batchSize)
  let filePath = args.write
  let filter = args.filter

  let getWords = i =>
    getMeaningfulWords({meansLike, limit: limit * i, maxWordLength})

  let availablePackageNames = await generateNames({
    getWords,
    limit,
    batchSize,
    filePath,
    filter,
  })

  outputToUser(filePath, availablePackageNames)
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
