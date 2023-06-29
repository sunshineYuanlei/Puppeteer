const chromeLauncher = require("chrome-launcher")
const puppeteer = require("puppeteer")
const lighthouse = require("lighthouse")
const config = require("lighthouse/lighthouse-core/config/lr-desktop-config.js")
const reportGenerator = require("lighthouse/lighthouse-core/report/report-generator")
const request = require("request")
const util = require("util")
const fs = require("fs")

;(async () => {
  // 默认配置
  const opts = {
    logLevel: "info",
    output: "json",
    disableDeviceEmulation: true,
    defaultViewport: {
      width: 1200,
      height: 900,
    },
    chromeFlags: ["--disable-mobile-emulation"],
  }

  // 使用 chromeLauncher 启动一个 chrome 实例
  const chrome = await chromeLauncher.launch(opts)
  opts.port = chrome.port
  console.log("port>>>", opts.port)

  // 使用 puppeteer.connect 连接 chrome 实例
  const resp = await util.promisify(request)(
    `http://localhost:${opts.port}/json/version`
  )
  console.log("resp>>>", resp)

  const { webSocketDebuggerUrl } = JSON.parse(resp.body)
  console.log("webSocketDebuggerUrl", webSocketDebuggerUrl)

  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  })

  //   访问逻辑
  page = (await browser.pages())[0]
  await page.setViewport({ width: 1200, height: 900 })
  const url = page.url()
  console.log("url", url)

  // 使用 lighthouse 产出报告
  const report = await lighthouse('https://www.baidu.com', opts, config)
  // console.log("report>>>", report)

  const html = reportGenerator.generateReport(report.lhr, "html")
  const json = reportGenerator.generateReport(report.lhr, "json")
  await browser.disconnect()
  // await chrome.kill()

  // 将报告写入文件系统
  fs.writeFile("report.html", html, (err) => {
    if (err) {
      console.error(err)
    }
  })
  fs.writeFile("report.json", json, (err) => {
    if (err) {
      console.error(err)
    }
  })
})()
