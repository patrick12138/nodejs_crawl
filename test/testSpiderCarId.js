const http = require('http');
let axios = require('axios')
const request = require('request');
let carType = "雅阁"
let url = encodeURI("https://www.dongchedi.com/motor/searchapi/search_content/?keyword="+carType+"&offset=0&count=10&cur_tab=1&city_name=广州&motor_source=pc&format=json")

async function getCardID() {
    let res = await axios.get(url)
    // console.log(res.data);
    var text = res.data;
    let cardID = text.data[0].series_id;
    // var text = JSON.parse(res.data)
    // var cardID = text['data'][0]['series_id'];
    // console.log(cardID);
    // console.log(typeof (cardID));
    return cardID;
}

// getCardID();

module.exports = {
    getCardID
}