const createPuppeteerPool = require("./createPuppeteerPool.js")

const pool = createPuppeteerPool({
  // puppeteerArgs: {
  //   args: config.browserArgs
  // }
})

module.exports = pool
