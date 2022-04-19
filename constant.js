const fs = require('fs');
// const car_types = ["朗逸","朗逸纯电", "帕萨特", "途昂", "途昂X", "威然", "PoLo",
// "辉昂", "途安L", "途观L", "途观X","途观L PHEV" ,"涂凯", "途岳"]
// const car_types = []
const car_types = ["朗逸","途观L PHEV"]

//存储汽车之家的系列车型的id，与上述对应 途安里面有途安L
const car_seriesId = ["614","5190","528","4232","5239",
    "5445","145","4045","333","4274","5826","4746","4993","4745"];

const jiangxi = ["宜春", "上饶", "吉安", "萍乡", "抚州", "南昌", "赣州", "景德镇", "新余", "九江"]

//湖北省直辖市里有天仙桃市、天门市、潜江市、神农架林区
const hubei = ["武汉", "黄石", "襄阳", "十堰", "荆州", "宜昌", "荆门", "孝感", "咸宁", "黄冈", "随州", "恩施", "天门", "仙桃", "潜江"]

//懂车帝里没有吉首市，也没有湘西土家族苗族自治州
const hunan = ["长沙", "株洲", "张家界", "岳阳", "永州", "益阳", "湘潭", "邵阳", "娄底", "怀化", "衡阳", "郴州", "常德"]

const jiangxiId = getId(jiangxi);
const hubeiId = getId(hubei);
const hunanId = getId(hunan);
// console.log(hunan.length)

function getId(cityName) {
    let cityJson = fs.readFileSync(`../json/city.json`);
    let cityObj = JSON.parse(cityJson)
    let city = cityObj.data.list;
    let cityId = []
    for (let i = 0; i < city.length; i++) {
        for (const cityNameElement of cityName) {
            if (cityNameElement === city[i].CityName)
                cityId.push(city[i].RegionId)
        }
    }
    return cityId
}

// console.log(getId(["南昌","广州"]));

function getCityName(cityId) {
    let cityJson = fs.readFileSync(`../json/city.json`);
    let cityObj = JSON.parse(cityJson)
    let city = cityObj.data.list;
    let cityName;
    for (const cityElement of city) {
        if (cityId === cityElement.RegionId)
            cityName = cityElement.CityName;
    }
    return cityName
}

// console.log(getCityName(360100));

module.exports = {
    jiangxi,
    jiangxiId,
    hubei,
    hubeiId,
    hunan,
    hunanId,
    car_types,
    car_seriesId,
    getId,
    getCityName
}