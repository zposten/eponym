function chunk(arr, size) {
  let copy = [...arr]
  let chunked = []

  while (copy.length) {
    let chunk = copy.splice(0, size)
    chunked.push(chunk)
  }

  return chunked
}

module.exports = {chunk}
