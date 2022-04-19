const axios = require('axios')
const iconv = require('iconv-lite');
let getDownPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxGetSeriesMaxPriceOff.ashx?seriesid=614&cityid=440100"
let getDealerPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxDealersBySpecId.ashx?specId=36593&cityId=440100"
let getCityDealerPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxDealersBySeriesId.ashx?seriesId=496&cityId=440100"
let getSpecDealerPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxDealerGetSeriesMinpriceWithSpecs.ashx?cityid=440100&seriesids=496"
async function getData() {
    let html = await getHtml()
    // let downPrice = await getDownPrice(url);
    // let dealerPrice = await getDealerPrice(url);
    // console.log($(".information-other .tit").eq(0).text().replace(/[\u4e00>]/,""));
    //这里是本地经销商的降价（关键数据），前端无，应该是json回传
    // console.log($(".information-other .con .price-down").text());
    //这里是经销商参考价（里面的a标签有查找不符合优惠的链接），前端无，应该是json回传
    // console.log("经销商参考价:"+$("#specWrap-2 .spec-lowest .lowest-price").text().replace(/[ \n]/g, ""));
    let $ = cheerio.load(html, {
        decodeEntities: false
    })
    // console.log("降价" + downPrice)
    // for (const el of dealerPrice) {
    //     console.log("经销商价格:"+el.price+" url:"+el.href)
    // }
    //#specWrap-2是属于在售列表的
    let $guid_price = $("#specWrap-2 .guidance-price__con span");
    let $car_name = $("#specWrap-2 .name-param a")
    let spec_id = []
    for (let i = 0; i < $guid_price.length; i++) {
        let guid_price = $guid_price.eq(i).text();
        let car_url = "https://www.autohome.com.cn" + $car_name.eq(i).attr("href")
        let specId = car_url.match(/\b\d{5}\b/g);
        spec_id.push(specId)
        // let car_name = $car_name.eq(i).text();
        // console.log("url: "+car_url+" "+car_name + " 指导价:" + guid_price)
    }
    console.log(spec_id)
}

async function getDownPrice(url) {
    let data = await getHtml(url)
    let dataJson = JSON.parse(data)
    console.log(dataJson.result)
    // let down_price = data.result.maxPrice0ff;
    // return down_price;
}

async function getDealerPrice(getDealerPriceurl) {
    let data = await getHtml(getDealerPriceurl)
    let dataJson = JSON.parse(data)
    let list = dataJson.result.list
    for (const listElement of list) {
        console.log(listElement.dealerInfoBaseOut.dealerName)
    }
}

async function getSpecDealerPrice(getSpecDealerPriceUrl) {
    let data = await getHtml(getSpecDealerPriceUrl);
    let dataJson = JSON.parse(data);
    let specs = dataJson.result[0].specs

    for (const spec of specs) {
        if(spec.minOriginalPrice !== 0){
            // console.log("厂商指导价"+spec.minOriginalPrice+"  "+spec.maxOriginalPrice)
            console.log(spec.specId)
            console.log("经销商参考价"+spec.newsPrice)
        }
    }
}


// getDownPrice(url)
// getDealerPrice(getDealerPriceurl);
getSpecDealerPrice(getSpecDealerPriceUrl)
// getDownPrice(url).then(res=>{
//     console.log(res)
// })

//获取本地经销商的降价
async function getDownPrice(url) {
    let options = {
        defaultViewport: {
            width: 1400,
            height: 800
        },
        headless: true
    }
    let browser = await puppeteer.launch(options)
    let page = await browser.newPage();
    await page.goto(url)
    return await page.$$eval(".price-down", elements => {
        return elements[0].innerText
    })
    await page.close();
}
//获取经销商参考价
async function getDealerPrice(url) {
    let options = {
        defaultViewport: {
            width: 1400,
            height: 800
        },
        headless: true
    }
    let browser = await puppeteer.launch(options)
    let page = await browser.newPage();
    await page.goto(url)
    return await page.$$eval("#specWrap-2 .spec-lowest .lowest-price a", elements => {
        let datas = []
        elements.forEach((item) => {
            let eleObj = {
                href: "https://www.autohome.com.cn" + item.getAttribute("href"),
                price: item.innerHTML
            }
            datas.push(eleObj)
            console.log(item.getAttribute("href"))
        })
        return datas;
    });
}


async function getHtml(url) {
    const res = await axios.get(url, {
        responseType: 'stream'
    }) //将数据转化为流返回
    // 返回一个promise实例对象
    return new Promise(resolve => {
        const chunks = []
        res.data.on('data', chunk => {
            chunks.push(chunk)
        })
        res.data.on('end', () => {
            const buffer = Buffer.concat(chunks)
            const str = iconv.decode(buffer, 'gbk')
            resolve(str)
        })
    })
}