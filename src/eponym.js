#!/usr/bin/env node

const eponym = require('commander')

eponym
  .command('dictionary')
  .alias('d')
  .description('Fetch words from a dictionary')
  .action(require('./commands/dictionary'))
  .option('-l, --limit <limit>', 'number of words to process')
  .option('--full-dictionary', 'process every word in the dictionary')
  .option(
    '-b, --batch-size <size>',
    'the number of HTTP requests out at once',
    20,
  )
  .option(
    '-m, --max-word-length <max>',
    'limit results to words of a certain length',
  )
  .option('-w, --write <filePath>', 'Write the results to a file')
  .option(
    '-p, --predictable',
    'Start from the beginning of the dictionary file',
  )

eponym
  .command('means <means-like>')
  .alias('m')
  .description('Fetch words with a similar meaning to another word')
  .action(require('./commands/means'))
  .option('-l, --limit <limit>', 'number of words to process', 50)
  .option(
    '-b, --batch-size <size>',
    'the number of HTTP requests out at once',
    20,
  )
  .option(
    '-m, --max-word-length <max>',
    'limit results to words of a certain length',
  )
  .option('-w, --write <filePath>', 'Write the results to a file')

eponym.version('0.1.0').parse(process.argv)
