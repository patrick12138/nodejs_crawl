const axios = require("axios")
const cheerio = require("cheerio")
let url = "https://car.yiche.com/xinbaolai/"
//https://car.yiche.com/yiqidazhongsmv/
// https://car.yiche.com/teramont/
// https://car.yiche.com/tharu/

//获取当前页面的需要数据
axios.get(url).then(res => {
    let $ = cheerio.load(res.data)
    //降价数据
    console.log($(".title1-price").text().replace(/>/g, ''));
    //位置
    console.log($("label").eq(0).text().replace(/：/g, ""));
    let $car_name = $(".car-item-jump");
    let $guide_price = $(".list-info .fouth");
    let $dealer_price = $(".list-info .five");

    for (let i = 0; i < $car_name.length; i++) {
        let car_name = $car_name.eq(i).text().replace(/^\s*/, "");
        let guide_price = $guide_price.eq(i).text().replace(/[ \n]/g, "")
        let dealer_price = $dealer_price.eq(i).text().replace(/[ \n]/g, "")
        console.log(car_name + " 指导价：" + guide_price + " 本地报价：" + dealer_price);
    }
})
