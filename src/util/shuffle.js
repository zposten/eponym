/**
 * Shuffles array in place.
 * See: https://stackoverflow.com/a/6274381/2517147
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  let j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

module.exports = {shuffle}
