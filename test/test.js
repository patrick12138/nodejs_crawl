// let urlDong = "https://www.dongchedi.com/auto/series/398?tt_web_version=old";
// request.get("", (err, res, body) => {
//     console.log(res);
//     console.log(err);
//     console.log(body);
// })
//axios的试用
// axios.get(urlJSON).then((res) => {
//     console.log(res.data);
//     // let $ = cheerio.load(res.data)
//     // console.log($('#__next'));
// })
// console.log(decodeURI("%3A518%2C"));
//superagent的试用
// data.then(res => {
//     var json = JSON.parse(res.text);
//     var json1 = json["concern_obj"]["car_id_list"]
//     var car_id = json1.split(',')
//     for (let i = 0; i < car_id.length; i++) {
//         const element = car_id[i];
//         //找具体型号
//         superagent.get(urlJSON).then(res => {
//             var json = JSON.parse(res.text);
//             var json1 = json["data"]["car_info"];
//             console.log(json1[0]["car_year"] + "款:" + json1[0]["car_name"]);
//             console.log("经销商报价:" + json1[0]["dealer_price"]);
//             console.log("指导价:" + json1[0]["official_price"]);
//             console.log("");
//         })
//     }
// })
let a = "2020款途昂 改款 380TSI 四驱舒适版";
let b = "2020款途昂 380TSI 四驱舒适版";
console.log(b.indexOf("2020款途昂 380TSI 四驱舒适版"));