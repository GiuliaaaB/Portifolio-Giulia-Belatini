const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const paths = ['', 'netglobe/', '7seven-drones/', 'diva-roma/', 'netglobe-store/', '7seven-network/', 'yaacov/'];
 let checks=0;
 for (const width of [360,768,1440]) {
  const context = await browser.newContext({viewport:{width,height:900}});
  const page = await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1') && r.status()>=400)errors.push(r.status()+' '+r.url());});
  for(const path of paths){
   await page.goto('http://127.0.0.1:8765/'+path);
   await page.waitForTimeout(1800);
   if(!path && width===360){
    await page.locator('.menu-toggle').click();
    if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('menu');
    await page.locator('.menu-toggle').click();
   }
   if(path==='netglobe/'||path==='7seven-drones/'){
    await page.locator('[data-direction="1"]').click();
    await page.waitForTimeout(700);
    if(await page.locator('[data-slide="1"]').getAttribute('aria-current')!=='true')throw Error('gallery '+path);
   }
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),title:!!document.querySelector('h1')?.getBoundingClientRect().height}));
   if(result.overflow||result.broken.length||!result.title||errors.length)throw Error(JSON.stringify({width,path,...result,errors}));
   checks++;
  }
  await context.close();
 }
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto('http://127.0.0.1:8765/');
 if(await page.locator('h1').evaluate(e=>getComputedStyle(e).opacity)!=='1')throw Error('no-JS heading hidden');
 const reduced=await browser.newContext({reducedMotion:'reduce'});const rp=await reduced.newPage();await rp.goto('http://127.0.0.1:8765/');await rp.waitForTimeout(1700);
 if(await rp.evaluate(()=>!!window.gsap))throw Error('GSAP loaded despite reduced motion');
 console.log(JSON.stringify({pagesAndViewports:checks,noJs:true,reducedMotion:true,consoleErrors:0,brokenImages:0}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
