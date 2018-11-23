const puppeteer = require('puppeteer');
const srcToImage = require('../config/helper/srcToImage');
const mn = require('../config/default').mn;
(async () => {
  const browser = await puppeteer.launch({
    executablePath:'../chrome-win/chrome.exe',
    // headless: false
  }); 
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com');
  console.log('go to https://image.baidu.com');
  
  await page.setViewport({
    width:1920,
    height:2080
  });
  console.log('reset viewport');
  await page.focus('#kw');
  await page.keyboard.sendCharacter('狗');
  await page.click('.s_search');
  console.log('go to search list');
  page.on('load',async ()=>{
    console.log('page loading...');
    const srcs = await page.evaluate(()=>{
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images,img => img.src)
    });
    console.log(`get ${srcs.length} image start download`);
    srcs.forEach(async(src) => {
      await page.waitFor(200);
      await srcToImage(src,mn);
    })
   
  });
 
  // await browser.close(); 
})();
