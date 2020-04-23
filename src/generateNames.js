const execa = require('execa')
const path = require('path')
const fs = require('fs-extra')
const {sample} = require('./util')

const {batch, ProgressBar} = require('./util')

async function doesPackageExist(packageName) {
  let cmd = `npm search ${packageName}`
  let {stdout} = await execa.command(cmd)
  return !stdout.includes('No matches found')
}

async function getWords({limit, maxWordLength, random}) {
  let filePath = path.resolve(__dirname, '../static/dictionary.txt')

  let file = await fs.readFile(filePath, 'utf8')
  let words = file.split('\n')

  if (maxWordLength) {
    words = words.filter((w) => w.length <= maxWordLength)
  }

  return random ? sample(words, limit) : words.slice(0, limit)
}

module.exports = async function generateNames({
  limit,
  batchSize,
  maxWordLength,
  filePath,
  random,
}) {
  let isAbsolutePath =
    filePath && (filePath.startsWith('/') || filePath[1] === ':')

  let absoluteFilePath = isAbsolutePath
    ? filePath
    : typeof filePath === 'string'
    ? path.resolve(process.cwd(), filePath)
    : null

  if (filePath) {
    // Empty the file
    await fs.outputFile(absoluteFilePath, '')
  }

  // Get the words from the dictionary
  let words = await getWords({limit, maxWordLength, random})

  let progressBar = Object.create(ProgressBar).start(words.length)
  let packageAvailability = await batch(words, {
    size: batchSize,
    async processItem(word) {
      // Determine if each word is a viable package name
      let packageExists = await doesPackageExist(word)
      progressBar.update()
      return packageExists ? null : word
    },
    async afterEachBatch(packageAvailability) {
      if (!absoluteFilePath) return

      // Output the results
      let availablePackageNames = packageAvailability.filter((word) => word)
      let packageNames = availablePackageNames.join('\n') + '\n'
      await fs.appendFile(absoluteFilePath, packageNames)
    },
  })

  progressBar.stop()

  let availablePackageNames = packageAvailability.filter((word) => word)
  let packageNames = availablePackageNames.join('\n')

  if (!filePath) console.log('\n' + packageNames)
  console.log(
    `\nWrote ${availablePackageNames.length} available package names${
      filePath ? ' to ' + filePath : ''
    }`,
  )
}
