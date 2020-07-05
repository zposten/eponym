const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

const generateNames = require('../helpers/generateNames')
const {sample} = require('../util')
const {outputToUser} = require('../helpers/output')

module.exports = async function dictionary(args) {
  if (!args.limit == !args.fullDictionary) {
    let msg =
      'You must supply either --limit or --full-dictionary, but not both'
    console.log(chalk.red(msg))
    process.exit(1)
  }

  if (args.fullDictionary && !args.write) {
    let msg =
      'You must use --write to output to a file when using --full-dictionary'
    console.log(chalk.red(msg))
    process.exit(1)
  }

  let limit = args.fullDictionary ? null : Number(args.limit)
  let maxWordLength = Number(args.maxWordLength)
  let random = !args.predictable
  let filePath = args.write

  let words = await getRandomWords({limit, maxWordLength, random})

  let availablePackageNames = await generateNames({
    words,
    batchSize: Number(args.batchSize),
    filePath,
  })

  let packageNames = availablePackageNames.join('\n')
  outputToUser(filePath, packageNames)
}

async function getRandomWords({limit, maxWordLength, random}) {
  let filePath = path.resolve(__dirname, '../../static/dictionary.txt')

  let file = await fs.readFile(filePath, 'utf8')
  let words = file.split('\n')

  if (maxWordLength) {
    words = words.filter(w => w.length <= maxWordLength)
  }

  if (!limit) return words
  return random ? sample(words, limit) : words.slice(0, limit)
}
