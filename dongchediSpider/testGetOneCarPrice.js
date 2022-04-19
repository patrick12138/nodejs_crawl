const axios = require('axios')
const dealerPrice = require('./dealerPrice')

let url = "https://www.dongchedi.com/motor/car_page/v4/get_entity_json/?car_id_list=51522&city_name=%E5%B9%BF%E5%B7%9E"

async function testGetOneCarPrice(oneCarIdUrl) {
    let {data} = await axios.get(oneCarIdUrl);
    let car_json = data.data.car_info;
    let year = car_json[0].car_year;
    let series_name = car_json[0].series_name;
    let car_id = car_json[0].car_id;
    let car_name = car_json[0].car_name;
    let dealer_price = car_json[0].dealer_price_value
    let official_price = car_json[0].info.official_price.compare_value
    let spread = ((official_price) - (dealer_price)).toFixed(2);
    if (spread > 4) {
        let city_name = oneCarIdUrl.replace(/^.+city_name=/, "")
        let url2 = "https://www.dongchedi.com/motor/dealer/m/v1/get_dealers_car_info/?car_id=" + car_id +
            "&city_name=" + city_name + "&sort_type=3"
        await dealerPrice.getPrice(url2).then(res => {
                console.log(res)
            }
        )
    }
    console.log(series_name + ": " + year + "款:" + car_name + "经销商报价:" + dealer_price
        + " 指导价:" + official_price + " 差价：" + spread + "万")
}
testGetOneCarPrice(url);