/**
 * Batch async processes on each item in an array
 * @param {Array} arr The array to iterate
 * @param {number} size The size of each batch
 * @param {Function<Promise>} callback Process each item (just like .map) and return a Promise
 */
async function batch(arr, {size, processItem, afterEachBatch}) {
  let numberOfBatches = Math.ceil(arr.length / size)
  let batchResults = []

  for (let i = 0; i < numberOfBatches; ++i) {
    let start = i * size
    let end = start + size
    let slice = arr.slice(start, end)

    let promises = slice.map(processItem)

    let results = await Promise.all(promises)
    batchResults.push(results)
    if (afterEachBatch) afterEachBatch(results)
  }

  // Flatten results of each batch into a single array
  return [].concat.apply([], batchResults)
}

module.exports = {batch}
