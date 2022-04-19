const axios = require('axios')

// let url = "https://www.dongchedi.com/motor/dealer/m/v1/get_dealers_car_info/?car_id=53347&city_name=%E5%8C%97%E4%BA%AC&sort_type=3"
async function getPrice(url) {
    let {data} = await axios.get(url)
    let dealerJson = data.data
    let dealer_price = (dealerJson[0].info.price)*10000;
    let dealer_full_name = dealerJson[0].info.dealer_full_name;
    let dealer_phone = dealerJson[0].info.dealer_phone;
    let dealer_name = dealerJson[0].info.dealer_name;
    let address = dealerJson[0].info.address;

    let dataSave = []
    for (const dealerJsonElement of dealerJson) {
        dataSave.push("[" + dealerJsonElement.info.dealer_type + "] " + dealerJsonElement.info.dealer_name +
            " 经销商报价:" + (dealerJsonElement.info.dealer_price)*10000 +
            // dealerJsonElement.info.address +
            " 经销商电话:" + dealerJsonElement.info.dealer_phone)
    }
    return dataSave;
}
// getPrice(url).then(resizeBy =>{
//     console.log(resizeBy)
// })
module.exports={
    getPrice
}