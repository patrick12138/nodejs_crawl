// const axios = require('axios')
// const constant = require('./city_cartype')
//
// const city_name = constant.jiangxi;
//
// const car_types = constant.car_types;
//
// let cityNameEncode = []
// for (const cityName of city_name) {
//     cityNameEncode.push(encodeURI(cityName))
// }
//
// //储存获取车系series_id的url
// let getSeriesIdUrl = []
// for (const carType of car_types) {
//     getSeriesIdUrl.push(encodeURI("https://www.dongchedi.com/motor/searchapi/search_content/?keyword=" +
//         carType + "&offset=0&count=10&cur_tab=1&city_name=%E5%B9%BF%E5%B7%9E&motor_source=pc&format=json"))
// }
//
// //获取车系series_id
// async function getSeriesId(getSeriesIdUrl) {
//     let {data} = await axios.get(getSeriesIdUrl)
//     return data.data[0].series_id;
// }

