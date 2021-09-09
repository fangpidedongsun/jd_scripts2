const download = require("download");
async function replaceWithSecrets(content, Secrets, ext) {
    if (!Secrets || !Secrets) return content;
    const replacements = [];
    await init_notify(Secrets, content, replacements);
    if (ext && typeof ext == "string") {
        if (content.indexOf("require('./jdCookie.js')") > 0) {
            replacements.push({ key: "require('./jdCookie.js')", value: `{CookieJD:'${ext}'}` });
        }
        if (content.indexOf("京东多合一签到") > 0 && content.indexOf("@NobyDa") > 0) {
            replacements.push({ key: /var Key = ''/, value: `var Key = '${ext}'` });
        }
    } else {
        if (Secrets.JD_COOKIE && content.indexOf("require('./jdCookie.js')") > 0) {
            replacements.push({ key: "require('./jdCookie.js')", value: JSON.stringify(Secrets.JD_COOKIE.split("&")) });
        }
        await downloader(content);
        if (Secrets.MarketCoinToBeanCount && !isNaN(Secrets.MarketCoinToBeanCount)) {
            let coinToBeanCount = parseInt(Secrets.MarketCoinToBeanCount);
            if (coinToBeanCount >= 0 && coinToBeanCount <= 20 && content.indexOf("$.getdata('coinToBeans')") > 0) {
                console.log("蓝币兑换京豆操作已注入");
                replacements.push({ key: "$.getdata('coinToBeans')", value: coinToBeanCount });
            }
        }
        if (Secrets.JoyFeedCount && !isNaN(Secrets.JoyFeedCount)) {
            let feedCount = parseInt(Secrets.JoyFeedCount);
            if ([10, 20, 40, 80].indexOf(feedCount) >= 0 && content.indexOf("$.getdata('joyFeedCount')") > 0) {
                console.log("宠汪汪喂食操作已注入");
                replacements.push({ key: "$.getdata('joyFeedCount')", value: feedCount });
            }
        }
        if (Secrets.Unsubscribe) {
            if (Secrets.Unsubscribe.split(",").length != 4) {
                console.log("取关参数不正确，请参考readme中的提示填入，记得用英文逗号,隔开");
            } else {
                let usinfo = Secrets.Unsubscribe.split(",");
                replacements.push({
                    key: "$.getdata('jdUnsubscribePageSize')",
                    value: isNaN(usinfo[0]) ? 0 : usinfo[0],
                });
                replacements.push({
                    key: "$.getdata('jdUnsubscribeShopPageSize')",
                    value: isNaN(usinfo[1]) ? 50 : usinfo[1],
                });
                replacements.push({ key: "$.getdata('jdUnsubscribeStopGoods')", value: `'${usinfo[2]}'` });
                replacements.push({ key: "$.getdata('jdUnsubscribeStopShop')", value: `'${usinfo[3]}'` });
            }
        }
    }
    return batchReplace(content, replacements);
}
function batchReplace(content, replacements) {
    for (var i = 0; i < replacements.length; i++) {
        content = content.replace(replacements[i].key, replacements[i].value);
    }
    return content;
}

async function init_notify(Secrets, content, replacements) {
    if (!Secrets.PUSH_KEY && !Secrets.BARK_PUSH && !Secrets.TG_BOT_TOKEN) {
        if (content.indexOf("require('./sendNotify')") > 0) {
            replacements.push({
                key: "require('./sendNotify')",
                value:
                    "{sendNotify:function(){},serverNotify:function(){},BarkNotify:function(){},tgBotNotify:function(){}}",
            });
        }
    } else {
        await download_notify();
        if (content.indexOf("京东多合一签到") > 0 && content.indexOf("@NobyDa") > 0) {
            console.log("京东多合一签到通知注入成功");
            replacements.push({
                key: "var LogDetails = false;",
                value: `const lxk0301Notify = require('./sendNotify');var LogDetails = false;`,
            });
            replacements.push({
                key: `if (!$nobyda.isNode) $nobyda.notify("", "", Name + one + two + three + four + disa + notify);`,
                value: `console.log("通知开始");lxk0301Notify.sendNotify("京东多合一签到", one + two + three + notify);console.log("通知结束");`,
            });
        }
    }
}
async function downloader(content) {
    if (content.indexOf("jdFruitShareCodes") > 0) {
        await download_jdFruit();
    }
    if (content.indexOf("jdPetShareCodes") > 0) {
        await download_jdPet();
    }
    if (content.indexOf("jdPlantBeanShareCodes") > 0) {
        await download_jdPlant();
    }
    if (content.indexOf("jdSuperMarketShareCodes") > 0) {
        await download_jdMarket();
    }
}

async function download_notify() {
    await download("https://github.com/lxk0301/scripts/raw/master/sendNotify.js", "./", {
        filename: "sendNotify.js",
    });
    console.log("下载通知代码完毕");
}
async function download_jdFruit(content) {
    await download("https://github.com/lxk0301/scripts/raw/master/jdFruitShareCodes.js", "./", {
        filename: "jdFruitShareCodes.js",
    });
    console.log("下载农场分享码代码完毕");
}
async function download_jdPet(content) {
    await download("https://raw.githubusercontent.com/lxk0301/scripts/master/jdPetShareCodes.js", "./", {
        filename: "jdPetShareCodes.js",
    });
    console.log("下载萌宠分享码代码完毕");
}
async function download_jdPlant(content) {
    await download("https://raw.githubusercontent.com/lxk0301/scripts/master/jdPlantBeanShareCodes.js", "./", {
        filename: "jdPlantBeanShareCodes.js",
    });
    console.log("下载种豆得豆分享码代码完毕");
}
async function download_jdMarket(content) {
    await download("https://raw.githubusercontent.com/lxk0301/scripts/master/jdSuperMarketShareCodes.js", "./", {
        filename: "jdSuperMarketShareCodes.js",
    });
    console.log("下载京小超分享码代码完毕");
}

module.exports = {
    replaceWithSecrets,
};
