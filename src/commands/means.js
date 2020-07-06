const dataMuse = require('datamuse')

const {outputToUser} = require('../helpers/output')
const generateNames = require('../helpers/generateNames')

module.exports = async function means(meansLike, args) {
  let limit = Number(args.limit)
  let maxWordLength = Number(args.maxWordLength)
  let batchSize = Number(args.batchSize)
  let filePath = args.write
  let filter = args.filter

  async function getWords(i) {
    if (i > 1) return []

    let words = await getMeaningfulWords({
      meansLike,
      limit,
      maxWordLength,
    })

    return words.slice(-limit)
  }

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

  let words = await dataMuse
    .words({ml: meansLike, max: dataMuseMax})
    .then(responses => responses.map(res => res.word))

  if (maxWordLength) {
    words = words.filter(word => word.length <= maxWordLength)
  }

  return words.slice(limit)
}
