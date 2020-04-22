const path = require('path')
const fs = require('fs-extra')

async function main() {
  let filePath = path.resolve(__dirname, '../static/dictionary.txt')
  let file = await fs.readFile(filePath, 'utf8')

  let words = file.split('\n')
  words = words.filter(
    (w) => !(w.trim().startsWith('-') || w.trim().endsWith('-')),
  )

  await fs.writeFile(filePath, words.join('\n') + '\n')
}

main()
