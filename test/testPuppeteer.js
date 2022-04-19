const puppeteer = require('puppeteer')
let url = "https://www.autohome.com.cn/496/#pvareaid=104399"

async function test(url) {
    let options = {
        defaultViewport: {
            width: 1400,
            height: 800
        },
        //设置为有界面，true则为无界面
        headless: false
        //设置放慢每个步骤的毫秒数
    }
    let browser = await puppeteer.launch(options)
    let page = await browser.newPage();
    await page.goto(url)
    let elements = await page.$$eval(".price-down", elements => {
        return elements[0].innerText
    })
    let eles = await page.$$eval("#specWrap-2 .spec-lowest .lowest-price a", elements => {
        // console.log(elements1)
        // console.log(elements1[0].innerText);
        let datas = []
        elements.forEach((item) => {
            let eleObj = {
                href: "https://www.autohome.com.cn"+item.getAttribute("href"),
                price: item.innerText
            }
            datas.push(eleObj)
            console.log(item.getAttribute("href"))
        })
        return datas;
    })
    //监听控制台的输出
    // page.on("console", (...args) => {
    //     console.log(args[0].text())
    // })
    console.log(elements)
    console.log(eles)
    await page.close()
}

test(url);