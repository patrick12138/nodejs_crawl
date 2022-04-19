const decodeData = require('../getUtf8Data')
// let getDealerPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxDealersBySeriesId.ashx?seriesId=614&cityId=360500"
// let getSpecDealerPriceUrl = "https://www.autohome.com.cn/ashx/dealer/AjaxDealersBySpecId.ashx?specId=48126&cityId=360500"
async function getDealerPrice(getSpecDealerPriceUrl) {
    let data = await decodeData.getHtml(getSpecDealerPriceUrl)
    let dataJson = JSON.parse(data)
    let list = dataJson.result.list
    let dataSave = []
    for (const listElement of list) {
        let spread = (listElement.maxOriginalPrice - listElement.minNewsPrice)
        // let dataObj = {
        //     dealer_name: listElement.dealerInfoBaseOut.dealerName,
        //     spread: spread
        // }
        dataSave.push(spread)
    }
    return dataSave;
}

// getDealerPrice(getDealerPriceUrl)
module.exports = {
    getDealerPrice
}