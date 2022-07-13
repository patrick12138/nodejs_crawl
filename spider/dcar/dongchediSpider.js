const axios = require('axios');
const cheerio = require('cheerio')
const constant = require('./city_cartype')
const currentDate = require('../currentDate')
const dealerPrice = require('./dealerPrice')

const city_name = constant.jiangxi;

const car_types = constant.car_types;
//当前时间
// console.log(currentDate.curTime)
//延时函数
async function lcWait(milliSecondes) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("成功执行延迟函数，延迟" + milliSecondes)
        }, milliSecondes)
    })
}

//存储转码之后的城市名字
let cityNameEncode = []
for (const cityNameElement of city_name) {
    cityNameEncode.push(encodeURI(cityNameElement))
}

//储存获取车系series_id的url，车型是变量
let getSeriesIdUrl = []
for (const carType of car_types) {
    getSeriesIdUrl.push(encodeURI("https://www.dongchedi.com/motor/searchapi/search_content/?keyword=" +
        carType + "&offset=0&count=10&cur_tab=1&city_name=%E5%B9%BF%E5%B7%9E&motor_source=pc&format=json"))
}

//获取车系series_id
async function getSeriesId(getSeriesIdUrl) {
    let {data} = await axios.get(getSeriesIdUrl)
    return data.data[0].series_id;
}

//系列号对应系列名
async function getSeriesName(series_id) {
    let url = "https://www.dongchedi.com/auto/series/" + series_id
    let data = await axios.get(url);
    let $ = cheerio.load(data.data);
    return $(".jsx-1771366932 .hide-line span:last").text();
}

//获取所有车型的series_id
async function getAllSeriesId() {
    let seriesId = []
    for (const seriesIdUrlElement of getSeriesIdUrl) {
        seriesId.push(await getSeriesId(seriesIdUrlElement))
    }
    return seriesId;
}

//返回获取当前全部车型的每一个车款的id (car_id_list)的url
async function getCarIdListUrl() {
    let seriesId = await getAllSeriesId();
    //获取当前全部车型的car_id_list的url
    let carIdListUrl = [];
    for (const seriesIdElement of seriesId) {
        carIdListUrl.push("https://www.dongchedi.com/motor/car_page/m/v1/get_head/?series_id="
            + seriesIdElement + "&city_name=%E5%B9%BF%E5%B7%9E&data_from=pc_station")
    }
    return carIdListUrl;
}

//返回获取当前全部车型的每一个车款的具体价格的url
async function getTotalCarIdUrl() {
    let carIdListUrl = await getCarIdListUrl();
    //存储当前全部车型的每一个车款的id  (car_id_list)
    let carID = []
    for (const carIdListUrlElement of carIdListUrl) {
        let {data} = await axios.get(carIdListUrlElement);
        let json = data.concern_obj.car_id_list
        carID.push(json.split(','));
    }
    //与城市名字拼接成最终的url
    let totalCarIdUrl = []
    for (let i = 0; i < carID.length; i++) {
        for (let j = 0; j < carID[i].length; j++) {
            for (const city_name of cityNameEncode) {
                totalCarIdUrl.push("https://www.dongchedi.com/motor/car_page/v4/get_entity_json/?car_id_list="
                    + carID[i][j] + "&city_name=" + city_name)
            }
        }
    }
    return totalCarIdUrl;
}

//当前车型的整体报价
async function getReferPrice(getReferPriceUrl) {
    let {data} = await axios.get(getReferPriceUrl);
    let dealerLowPrice = ((data.data.DealerLowPrice) * 10000).toFixed(0)
    let dealerHighPrice = ((data.data.DealerHighPrice) * 10000).toFixed(0)
    let officialLowPrice = ((data.data.OfficialLowPrice) * 10000).toFixed(0)
    let officialHighPrice = ((data.data.OfficialHighPrice) * 10000).toFixed(0)
    let spreadLow = (officialLowPrice - dealerLowPrice).toFixed(0)
    let spreadHigh = (officialHighPrice - dealerHighPrice).toFixed(0);
    let city_name = decodeURI(getReferPriceUrl.replace(/^.+city_name=/, ""))
    let series_name = await getSeriesName((getReferPriceUrl.match(/\b\d{3,4}\b/g))[0]);
    let dataObj = {
        dealer_price: "经销商报价:" + dealerLowPrice + " - " + dealerHighPrice,
        guid_price: "厂商指导价:" + officialLowPrice + " - " + officialHighPrice,
        spreadLow: spreadLow,
        spreadHigh: spreadHigh,
        city_name: city_name
    }
    if (dataObj.spreadHigh !== dataObj.spreadLow) {
        console.log(getReferPriceUrl)
    }
    console.log(series_name + " " + dataObj.dealer_price + " " + dataObj.guid_price + " 最低差价:" + spreadLow
        + " 最高差价：" + spreadHigh + " 城市：" + city_name);
    // return dataObj
}

//单个具体车款的具体报价
async function getOneCarPrice(oneCarIdUrl, referPrice) {
    let {data} = await axios.get(oneCarIdUrl);
    let car_json = data.data.car_info;
    let year = car_json[0].car_year;
    let series_name = car_json[0].series_name;
    let series_id = car_json[0].series_id
    let car_id = car_json[0].car_id;
    let car_name = car_json[0].car_name;
    let dealer_price = (car_json[0].dealer_price_value * 10000).toFixed(0)
    let official_price = ((car_json[0].info.official_price.compare_value) * 10000).toFixed(0)
    let spread = ((official_price) - (dealer_price));
    let city_name = decodeURI(oneCarIdUrl.replace(/^.+city_name=/, ""))
    let dataObj = {
        car_name: year + "款" + series_name + " " + car_name,
        dealer_price: dealer_price,
        official_price: official_price,
        spread: spread,
    }
    console.log(dataObj.car_name + " 经销商报价:" + dealer_price
        + " 指导价:" + official_price + " 差价：" + spread + " 优惠" + " 城市:" + city_name)

    // if (year === "2021" && series_name === "途岳" && car_name === "280TSI 两驱豪华版" && official_price === 18.88) {
    // // if (dealer_price > 16.28)
    //     if (spread > 2.3) {
    //         let getDealerPriceUrl = "https://www.dongchedi.com/motor/dealer/m/v1/get_dealers_car_info/?car_id=" + car_id +
    //             "&city_name=" + city_name + "&sort_type=3"
    //         let result = await dealerPrice.getPrice(getDealerPriceUrl)
    //         console.log("网址：" + "https://www.dongchedi.com/dealer/" + series_id + "?carId=" + car_id + "&zt=default_pc_pc_series_car_list");
    //         console.log(result)
    //     }
    // }

}

//全部城市的报价
async function getAllReferPrice() {
    let seriesId = await getAllSeriesId();
    let getReferPriceUrls = [];
    for (const series_id of seriesId) {
        for (const cityName of cityNameEncode) {
            getReferPriceUrls.push("https://www.dongchedi.com/cloud/api/invoke/get_price_by_series_id?series_id="
                + series_id + "&city_name=" + cityName);
        }
    }
    let allReferPriceSave = []
    for (const referPriceUrl of getReferPriceUrls) {
        await lcWait(100)
        allReferPriceSave.push(await getReferPrice(referPriceUrl))
    }
    return allReferPriceSave
}

// getAllReferPrice()

// 当前车型全部车款的报价输出
async function getTotalPrices() {
    let totalCarIdUrl = await getTotalCarIdUrl();
    for (const oneCarIdUrl of totalCarIdUrl) {
        await lcWait(200)
        await getOneCarPrice(oneCarIdUrl)
    }
}

getTotalPrices();

