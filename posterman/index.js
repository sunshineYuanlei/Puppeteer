const render = require("./render.js")
const express = require("express")

const app = express()

app.get("/", async (req, res, next) => {
  // const urls = [{name: '搜狐快照', value: 'https://www.sohu.com/'}, {name: '百度快照', value: 'https://www.baidu.com/'}]
  // const ctx = { request: { query: { url:  urls[1].value } }, res }
  const {query: {url, width, height}} = req
  console.log('width', width, height)
  const request = { query: { url, width, height  } }
  const { image, type, filename } = await render(request)
  res.set("Content-Type", `image/${type}`)
  res.set("Content-Disposition", `inline; filename=${filename}.${type}`)
  return res.status(200).send(image)
})

app.listen(8080, () => console.log("Server started. Press Ctrl+C to quit"))
