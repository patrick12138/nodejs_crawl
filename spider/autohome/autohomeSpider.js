const axios = require("axios")
const cheerio = require("cheerio")
const decodeData = require('../getUtf8Data')
const dealerPrice = require('./dealerPrice')
const constant = require('../constant')

// let getDownPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxGetSeriesMaxPriceOff.ashx?seriesId="
//     + seriesId + "&cityId=360100" //+ cityId;
// let getDealerPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxDealersBySpecId.ashx?specId=36593&cityId=440100"

let car_seriesId = constant.car_seriesId;
let cityId = constant.hubeiId;

//存储拼接好的主车型的url
let car_urls = [];
for (const seriesId of car_seriesId) {
    car_urls.push("https://www.autohome.com.cn/" + seriesId)
}
//存储拼接好（seriesId+cityId）的得到具体车款经销商报价的url
let getSeriesDealerPriceUrls = []
//存储拼接好（seriesId+cityId）的得到本地经销商城市和本地经销商降价的url
let getDownPriceUrls = []
for (const seriesId of car_seriesId) {
    for (const cityIdElement of cityId) {
        getSeriesDealerPriceUrls.push("https://www.autohome.com.cn/ashx/dealer/AjaxDealerGetSeriesMinpriceWithSpecs.ashx?seriesids="
            + seriesId + "&cityId=" + cityIdElement)
        getDownPriceUrls.push("https://www.autohome.com.cn/ashx/dealer/AjaxGetSeriesMaxPriceOff.ashx?seriesId="
            + seriesId + "&cityId=" + cityIdElement)
    }
}

//延时函数
async function lcWait(milliSecondes) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("成功执行延迟函数，延迟" + milliSecondes)
        }, milliSecondes)
    })
}

//获取具体车款名字,对应的url,指导价
async function getData(car_url) {
    let html = await decodeData.getHtml(car_url)
    let $ = cheerio.load(html, {
        decodeEntities: false
    })
    let $guid_price = $("#specWrap-2 .guidance-price__con span");
    let $car_name = $("#specWrap-2 .name-param .name")
    let data = []
    for (let i = 0; i < $guid_price.length; i++) {
        // let guid_price = $guid_price.eq(i).text();
        let car_url = "https://www.autohome.com.cn" + $car_name.eq(i).attr("href")
        let dataObj = {
            car_series_name: $(".athm-sub-nav__car__name h1").text(),
            car_name: $car_name.eq(i).text(),
            guid_price: ((parseFloat($guid_price.eq(i).text())) * 10000).toFixed(0),
            car_url: car_url,
            spec_id: car_url.match(/\b\d{5}\b/g)
        }
        data.push(dataObj)
    }
    return data
}

//获取本地经销商降价
async function getDownPrice(getDownPriceUrl) {
    let data = await decodeData.getHtml(getDownPriceUrl)
    let dataJson = JSON.parse(data)
    let down_price = dataJson.result.maxPrice0ff;
    return down_price
    // let dataObj = {
    //     down_price: dataJson.result.maxPrice0ff,
    //     city_name: constant.getCityName(dataJson.result.cityId),
    //     // spead: dataJson.result.maxOriginalPrice - dataJson.result.minOriginalPrice,
    //     seriesName: dataJson.result.seriesName
    // }
    // let dataSave = []
    // dataSave.push(dataObj)
    // console.log("城市："+dataObj.city_name+" 本地经销商降价为:"+dataObj.down_price)
}

//
async function getSeriesDealerPrice(getSeriesDealerPriceUrl, downPrice, carData) {
    let data = await decodeData.getHtml(getSeriesDealerPriceUrl);
    let dataJson = JSON.parse(data);
    let specs = dataJson.result[0].specs;
    let dataSave = [];
    for (const carDataEl of carData) {
        // console.log(carDataEl.spec_id[0])
        for (const spec of specs) {
            if (carDataEl.spec_id[0] == spec.specId) {//这里是过滤出在售的车款
                // let city_id = getSeriesDealerPriceUrl.match(/\b\d{6}\b/g)[0];
                // let getSpecDealerPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxDealersBySpecId.ashx?specId=" + spec.specId +
                //     "&cityId=" + city_id;
                // let everyDealerSpread = await dealerPrice.getDealerPrice(getSpecDealerPriceUrl)
                let spread = (carDataEl.guid_price - spec.newsPrice).toFixed(0);//差价，指导价与经销商报价的差值
                if (spread != downPrice) {//当差价与本地经销商降价不相等时
                    let city_name = constant.getCityName(parseInt((getSeriesDealerPriceUrl.match(/\b\d{6}\b/g))[0]));
                    let car_name = carDataEl.car_name.slice(0, 5) + carDataEl.car_series_name + carDataEl.car_name.slice(5);
                    let dataObj = {
                        city_name: city_name,//城市名字
                        carData: car_name,
                        url: carDataEl.car_url,
                        guid_price: carDataEl.guid_price,//具体车款的指导价
                        newsPrice: spec.newsPrice,//经销商参考价
                        down_price: downPrice,// 本地经销商的降价
                        spread: spread // 车款的指导价 - 经销商参考价 的 差价
                    }
                    dataSave.push(dataObj)
                }
            }
        }
    }
    return dataSave
}

//
(async function getAllDealerPrices() {
    let carDataSave = []
    for (const carUrl of car_urls) {
        carDataSave.push(await getData(carUrl))
    }
    let downPriceSave = []
    for (const downPriceUrl of getDownPriceUrls) {
        downPriceSave.push(await getDownPrice(downPriceUrl))
    }
    let j = 0;
    for (let i = 0; i < getSeriesDealerPriceUrls.length; i++) {
        if (!(i % cityId.length)) {
            j += 1;
        }
        getSeriesDealerPrice(getSeriesDealerPriceUrls[i], downPriceSave[i], carDataSave[j - 1]).then(result => {
            if (result.length !== 0) {
                console.log(result)
            }
        })
    }
})();

// (async function getAllDownPrices() {
//     for (const downPriceUrl of getDownPriceUrls) {
//         await lcWait(100);
//         getDownPrice(downPriceUrl).then(res => {
//             console.log(res)
//         });
//     }
// })();

// getSpecDealerPrice(getSpecDealerPriceUrls[0]).then(res => {
//     console.log(res)
// })