/*
京小超互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等Node.js用户在此处填写京小超商圈的好友码。
// github action用户的好友互助码填写到Action->Settings->Secrets->new Secret里面(Name填写 SuperMarketShareCodes(此处的Name必须按此来写,不能随意更改),内容处填写互助码,填写规则如下)
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let SuperMarketShareCodes = [
]
// 判断github action里面是否有京小超商圈互助码
if (process.env.SUPERMARKET_SHARECODES) {
  if (process.env.SUPERMARKET_SHARECODES.indexOf('&') > -1) {
    console.log(`您的京小超商圈互助码选择的是用&隔开\n`)
    SuperMarketShareCodes = process.env.SUPERMARKET_SHARECODES.split('&');
  } else if (process.env.SUPERMARKET_SHARECODES.indexOf('\n') > -1) {
    console.log(`您的京小超商圈互助码选择的是用换行隔开\n`)
    SuperMarketShareCodes = process.env.SUPERMARKET_SHARECODES.split('\n');
  } else {
    SuperMarketShareCodes = process.env.SUPERMARKET_SHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < SuperMarketShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['SuperMarketShareCode' + index] = SuperMarketShareCodes[i];
}
