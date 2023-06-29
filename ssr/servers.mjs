import express from "express"
import puppeteer from "puppeteer"
import ssr from "./ssr.mjs"

// 重复使用 Chrome 实例
let browserWSEndpoint = null
const app = express()

app.get("/", async (req, res, next) => {
  if (!browserWSEndpoint) {
    // 一下两行代码不必随着渲染重复执行
    const browser = await puppeteer.launch()
    browserWSEndpoint = await browser.wsEndpoint()
  }
  // const url = `${req.protocol}://${req.get('host')}/index.html`
  // console.log('url>>>', url)
  // const {html, ttRenderMs} = await ssr(url, browserWSEndpoint)
  const { html, ttRenderMs } = await ssr(
    `https://www.jd.com/?cu=true&utm_source=hao.360.com&utm_medium=tuiguang&utm_campaign=t_1000003625_360mz&utm_term=6e74a90b77bc4ac3a5165b0c8364b511`
  )

  res.set(
    "Server-Timing",
    `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`
  )
  console.log(res.get("Server-Timing"))
  return res.status(200).send(html)
})

app.listen(8080, () => console.log("Server started. Press Ctrl+C to quit"))
