const dataMuse = require('datamuse')

const {outputToUser} = require('../helpers/output')
const generateNames = require('../helpers/generateNames')

module.exports = async function means(meansLike, args) {
  let limit = Number(args.limit)
  let maxWordLength = Number(args.maxWordLength)
  let batchSize = Number(args.batchSize)
  let filePath = args.write
  let filter = args.filter

  let previousLastWord = ''
  async function getWords(i) {
    let words = await getMeaningfulWords({
      meansLike,
      limit,
      maxWordLength,
      startsWith: letters[i],
    })

    let lastWord = words[words.length - 1]
    let moreWordsRemaining = lastWord !== previousLastWord
    previousLastWord = lastWord

    return moreWordsRemaining ? words.slice(-limit) : []
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

async function getMeaningfulWords({
  meansLike,
  limit,
  maxWordLength,
  startsWith,
}) {
  const dataMuseMax = 1000

  let words = await dataMuse
    .words({ml: meansLike, sp: startsWith + '*', max: dataMuseMax})
    .then(responses => responses.map(res => res.word))

  if (maxWordLength) {
    words = words.filter(word => word.length <= maxWordLength)
  }

  return words.slice(limit)
}

const letters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]
