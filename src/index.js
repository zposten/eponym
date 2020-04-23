#!/usr/bin/env node

const {program} = require('commander')
const generateNames = require('./generateNames')
const chalk = require('chalk')

// prettier-ignore
program
  .option('-l, --limit <limit>', 'number of words to process')
  .option('--full-dictionary', 'process every word in the dictionary')
  .option('-b, --batch-size <size>', 'the number of HTTP requests out at once', 20)
  .option('-m, --max-word-length <max>', 'limit results to words of a certain length')
  .option('-w, --write <filePath>', 'Write the results to a file')
  .option('-p, --predictable', 'Start from the beginning of the dictionary file')
  .parse(process.argv)

if (!program.limit == !program.fullDictionary) {
  let msg = 'You must supply either --limit or --full-dictionary, but not both'
  console.log(chalk.red(msg))
  process.exit(1)
}

if (program.fullDictionary && !program.write) {
  let msg =
    'You must use --write to output to a file when using --full-dictionary'
  console.log(chalk.red(msg))
  process.exit(1)
}

generateNames({
  limit: program.fullDictionary ? null : program.limit,
  batchSize: program.batchSize,
  maxWordLength: program.maxWordLength,
  filePath: program.write,
  random: !program.predictable,
})
