import express from "express"
import ssr from "./ssr.mjs"

const app = express()

app.get("/", async (req, res, next) => {
  // 调用 SSR 方法渲染页面
  const { html, ttRenderMs } = await ssr(
    `https://hao.360.com/?a1004`
  )
  // const { html, ttRenderMs } = await ssr(`http://192.168.1.110:8000/ssr.html`)
  res.set(
    "Server-Timing",
    `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`
  )
  console.log(res.get("Server-Timing"))
  return res.status(200).send(html)
})

app.listen(8080, () => console.log("Server started. Press Ctrl+C to quit"))
