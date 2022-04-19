const axios = require('axios')

async function setCity(){

}

axios.get("https://newsapi.yiche.com/citybase/setcookie",{
    headers:{

        // Cookie: "CIGUID=ef592ee3-5543-4074-b51a-99c5291b6520; " +
        //     "CIGDCID=mQm5QhCsseKztfXi8Dtj6H2sGxr5GZHw; UserGuid=ef592ee3-5543-4074-b51a-99c5291b6520; " +
        //     "csids=6875_1796_4936_5714_1699_2381_5398_4873_6600_4597; locatecity=450600; selectcity=440600; " +
        //     "selectcityid=518; selectcityName=%E4%BD%9B%E5%B1%B1; " +
        //     "bitauto_ipregion=183.36.228.112%3a%e5%b9%bf%e4%b8%9c%e7%9c%81%e5%b9%bf%e5%b7%9e%e5%b8%82%3b518%2c%e4%bd%9b%e5%b1%b1%e5%b8%82%2cfoshan"
    }
}).then(res=>{
    console.log(res.data)
})