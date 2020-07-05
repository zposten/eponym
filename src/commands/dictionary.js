const chalk = require('chalk')

const generateNames = require('../generateNames')

function dictionary(args) {
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

  generateNames({
    limit: args.fullDictionary ? null : Number(args.limit),
    batchSize: Number(args.batchSize),
    maxWordLength: Number(args.maxWordLength),
    filePath: args.write,
    random: !args.predictable,
  })
}

module.exports = dictionary
