const puppeteer = require("puppeteer")

// 测试页面 title 符合预期
test("baidu title is correct", async () => {
  // 启动一个无头浏览器
  const browser = await puppeteer.launch()
  // 通过无头浏览器访问页面
  const page = await browser.newPage()
  await page.goto("https://www.baidu.com/")
  // 获取页面 title
  const title = await page.title()
  // 使用 Jest 的 test 和 expect 两个全局函数进行断言
  expect(title).toBe("百度一下，你就知道")
  console.log("true")
  await browser.close()
})
