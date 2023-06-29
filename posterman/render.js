// 获取连接池
const pool = require("./pool.js")

const render = (
  request,
  handleFetchPicoImageError = (error) => {
    console.error(error)
  }
) =>
  // 使用连接池资源
  pool.use(async (browser) => {
    // browser也就是pool.use方法中的resource, 也就是factory.create()的返回值
    // ctx为请求的context, 其中, body为请求体参数, query为查询参数（在url中拼接的参数）
    const { body = "", query } = request
    // 打开新的页面
    const page = await browser.newPage()
    // 服务支持直接传递 HTML 字符串内容
    let html = body
    // 从请求服务的 query 获取默认参数
    // 一个比较好的思路是浏览器在访问当前需要截屏的页面的时候, 把当前设备/浏览器的宽度(例如window.innerWidth)传给服务端, 结合页面的固定宽高比算出高度, 然后智能截图适配
    let {
      width = 1280,
      height = 2000,
      ratio: deviceScaleFactor = 2,
      type = "png",
      filename = "poster",
      waitUntil = ["networkidle0", "load", "domcontentloaded"],
      quality = 100,
      omitBackground = "true",
      fullPage = "true",
      url,
    } = query
    let image
    try {
      if (html.length > 1.25e6) {
        throw new Error("image size out of limits, at most 1 MB")
      }

      console.log("width>>>", width, height)
      // 设置浏览器视口
      await page.setViewport({
        width: Number(width),
        height: Number(height),
        deviceScaleFactor: Number(deviceScaleFactor),
      })

      // waitUntil=["networkidle0", "load", "domcontentloaded"], 其中networkidle0代表"网络空闲"

      // 访问 URL 页面
      await page.goto(url || `data:text/html,${html}`, {
        waitUntil,
      })

      // 进行截图
      type = type === "jpg" ? "jpeg" : type
      image = await page.screenshot({
        type,
        quality: type === "png" ? undefined : Number(quality),
        omitBackground: omitBackground === "true",
        fullPage: fullPage === "true",
        path: `${filename}.${type}`,
      })
    } catch (error) {
      handleFetchPicoImageError(error)
      throw error
    }

    await page.close()
    return { image, type, filename }
  })

module.exports = render
