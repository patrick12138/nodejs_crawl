const axios = require("axios")
const iconv = require('iconv-lite');

// 封装获取网页解决乱码的函数
async function getHtml(url) {
    const res = await axios.get(url, {
        responseType: 'stream'
    }) //将数据转化为流返回
    // 返回一个promise实例对象
    return new Promise(resolve => {
        const chunks = []
        res.data.on('data', chunk => {
            chunks.push(chunk)
        })
        res.data.on('end', () => {
            const buffer = Buffer.concat(chunks)
            const str = iconv.decode(buffer, 'gbk')
            resolve(str)
        })
    })
}

module.exports = {
    getHtml
}