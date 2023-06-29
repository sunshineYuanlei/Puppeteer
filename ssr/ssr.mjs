import puppeteer from 'puppeteer';

// 将已经渲染过的页面，缓存在内存中
const RENDER_CACHE = new Map();

// 重复使用 Chrome 实例
let browserWSEndpoint = null
let browser

async function ssr(url) {
	// 命中缓存
  if (RENDER_CACHE.has(url)) {
    return {html: RENDER_CACHE.get(url), ttRenderMs: 0};
  }
  const start = Date.now();
  // 使用 Puppeteer launch 一个无头浏览器
 
  if (!browserWSEndpoint) {
    // 一下两行代码不必随着渲染重复执行
    browser = await puppeteer.launch()
    browserWSEndpoint = await browser.wsEndpoint()
  }
  
  const page = await browser.newPage();
  try {
    // 访问页面地址直到页面网络状态为 idle
    await page.goto(url, {waitUntil: 'networkidle0'});
    // 确保 #doc 节点已经存在
    await page.waitForSelector('#doc');
    // await page.waitForSelector('#posts');
  } catch (err) {
    console.error('err>>>', err);
    throw new Error('page.goto/waitForSelector timed out.');
  }
	// 获取 html 内容
  const html = await page.content(); 
  // 关闭无头浏览器
  await browser.close();
  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

	// 进行缓存存储
  RENDER_CACHE.set(url, html);
  return {html, ttRenderMs};
}

export {ssr as default};
 