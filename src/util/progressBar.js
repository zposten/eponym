const {SingleBar, Presets} = require('cli-progress')

let ProgressBar = {
  updateCount: 0,
  start(total) {
    this.bar = new SingleBar(
      {format: `{bar} {percentage}% | {value}/{total}`},
      Presets.shades_classic,
    )
    this.bar.start(total, this.updateCount)
    return this
  },

  update() {
    this.bar.update(++this.updateCount)
    return this
  },

  stop() {
    this.bar.stop()
    return this
  },
}

module.exports = {ProgressBar}
