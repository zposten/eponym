const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

const generateNames = require('../helpers/generateNames')
const {sample} = require('../util')
const {outputToUser} = require('../helpers/output')

module.exports = async function search(args) {
  let limit = Number(args.limit)
  let maxWordLength = Number(args.maxWordLength)
  let batchSize = Number(args.batchSize)
  let random = !args.predictable
  let filePath = args.write
  let filter = args.filter

  function getWords(i) {
    return getDictionaryWords({limit, maxWordLength, random, offset: i * limit})
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

async function getDictionaryWords({limit, maxWordLength, random, offset}) {
  let filePath = path.resolve(__dirname, '../../static/dictionary.txt')

  let file = await fs.readFile(filePath, 'utf8')
  let words = file.split('\n')

  if (maxWordLength) {
    words = words.filter(w => w.length <= maxWordLength)
  }

  if (!limit) return words
  return random ? sample(words, limit) : words.slice(offset, offset + limit)
}
