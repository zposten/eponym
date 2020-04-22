function sample(arr, size = 1) {
  if (!arr) return []
  if (size === 1) return randomItem(arr)

  let indices = new Set()
  while (indices.size < size) {
    indices.add(randomIndex(arr))
  }

  return Array.from(indices).map((index) => arr[index])
}

function randomIndex(arr) {
  return Math.floor(Math.random() * arr.length)
}

function randomItem(arr) {
  arr[randomIndex()]
}

module.exports = {sample}
