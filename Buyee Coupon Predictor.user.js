// ==UserScript==
// @name         Buyee Coupon Predictor
// @namespace    http://companionkitteh.com/
// @version      1.0
// @description  Predicts upcoming Buyee coupons
// @author       CompanionKitteh
// @match        https://buyee.jp/mycoupon/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @grant        GM_xmlhttpRequest
// @connect      https://buyee.jp/coupon?code=*
// ==/UserScript==

const percents = [5, 7, 10, 12, 15, 20];
const marketplaces = ["mercari", "yahooauction"];

(async () => {
    for (let i = 0; i < marketplaces.length; i++) {
        let marketplace = marketplaces[i];
        let infoCoupon = `<section id="coupon_" class="mycoupon infoCoupon infoCoupon${marketplace}"><h2 class="shopping_cart_name bg_red">` +
            `Upcoming Coupons - ${marketplace}` +
            '</h2><ul><li><div class="coupon_area"><div class="description_area"><dl><dt>' +
            'Coupon Information' +
            '</dt><dd>' +
            'No data...' +
            '</dd></dl></div><div class="information_area"><dl><dd class="bold coupon-amount">' +
            '0<span>&nbsp;FOUND</span>' +
            `</dd></dl><button type="button" class="btn btn_ok infoCouponButton infoCouponButton${marketplace}"><i>` +
            'Search for Coupons' +
            '</i></button></div></div></li></ul></section>';
        document.querySelector("#content_inner > div > nav").insertAdjacentHTML("afterend", infoCoupon);
        document.getElementsByClassName(`infoCouponButton${marketplace}`)[0].addEventListener("click", () => { go(marketplaces[i]) });
    }
})();

async function go(marketplace) {
    let coupons = [];
    for (let i = 0; i < percents.length; i++) {
        let tries = 0;
        for (let couponNumber = 1; ; couponNumber++) {
            if (tries == 3) break;
            updateCouponInfo(marketplace, coupons, false);
            let url = constructCouponUrl(marketplace, percents[i]);
            url = url.replace("nn", zeroPad(couponNumber, 2));
            let siteHtml = await makeGetRequest(url);
            if (!isValidResponse(siteHtml)) {
                tries++;
                continue;
            } else {
                tries = 0;
            }
            let coupon = parseCoupon(siteHtml, marketplace, url);
            coupons.push(coupon);
        }
    }
    updateCouponInfo(marketplace, coupons, true);
}

// @param coupons A list of coupons that have been processed so far
// @param done Whether or not all coupons have been processed
function updateCouponInfo(marketplace, coupons, done) {
    let infoCoupon = document.getElementsByClassName(`infoCoupon${marketplace}`)[0];
    let descriptionArea = infoCoupon.querySelector("ul > li > div > div.description_area > dl > dd");
    let informationArea = infoCoupon.querySelector("ul > li > div > div.information_area > dl > dd");
    let couponCount = coupons.length;
    if (done) {
        let couponInfo = ""
        for (let i = 0; i < couponCount; i++) {
            couponInfo += `${prettyPrintCoupon(coupons[i])}<br><br>`;
        }
        descriptionArea.innerHTML = couponInfo;
    } else {
        descriptionArea.innerHTML = `Searching for coupons${".".repeat(couponCount)}`;
    }
    informationArea.innerHTML = `${couponCount}<span>&nbsp;FOUND</span>`;
}

// @param coupon A coupon to pretty print
// @return A pretty print of the coupon
function prettyPrintCoupon(coupon) {
    let now = new Date();
    let startDateText = `<span ${coupon.usagePeriod.startDate < now ? 'style="color:red;"' : ''}>${coupon.usagePeriod.startDate}</span>`;
    let endDateText = `<span ${coupon.usagePeriod.endDate < now ? 'style="color:red;"' : ''}>${coupon.usagePeriod.endDate}</span>`;
    return `<strong>${coupon.percentOff}% off of ${coupon.category}</strong><a href=${coupon.url}>[link]</a><br>from ${startDateText}<br>to ${endDateText}`;
}

// @param string A string to pad with zeroes
// @param zeroes The number of zeroes to pad the string with
// @return The zero padded string
function zeroPad(string, zeroes) {
    return ("0".repeat(zeroes) + string).slice(-zeroes);
}

// @param percent A coupon percentage
// @param marketplace A marketplace
// @return A coupon URL of form https://buyee.jp/coupon?code=marketplaceYYMM%%nn
function constructCouponUrl(marketplace, percent) {
    const year = zeroPad(new Date().getYear(), 2);
    const month = zeroPad(new Date().getMonth() + 1, 2);
    percent = zeroPad(percent, 2);
    return `https://buyee.jp/coupon?code=${marketplace}${year}${month}${percent}nn`;
}

// @param url A URL to GET
// @return A promise of the page HTML
function makeGetRequest(url) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                resolve(response.responseText);
            }
        });
    });
}

// @param siteHtml A page's HTML
// @return Whether or not the page is an error page
function isValidResponse(siteHtml) {
    return !siteHtml.match(/this is original message|We were unable to find the coupon./);
}

// @param siteHtml A page's HTML
// @param marketplace The coupon's marketplace
// @param url The page's URL
// @return An object containing the coupon information
function parseCoupon(siteHtml, marketplace, url) {
    const document = new DOMParser().parseFromString(siteHtml, "text/html");
    return {
        usagePeriod: {
            startDate: new Date(document.querySelector("#regist_form_wrap > section:nth-child(1) > div.couponDescription__period > dl > dd:nth-child(2)").innerText.split("〜")[0] + " +0900"),
            endDate: new Date(document.querySelector("#regist_form_wrap > section:nth-child(1) > div.couponDescription__period > dl > dd:nth-child(2)").innerText.split("〜")[1] + " +0900"),
        },
        entryDate: {
            startDate: new Date(document.querySelector("#regist_form_wrap > section:nth-child(1) > div.couponDescription__period > dl > dd:nth-child(4)").innerText.split("〜")[0] + " +0900"),
            endDate: new Date(document.querySelector("#regist_form_wrap > section:nth-child(1) > div.couponDescription__period > dl > dd:nth-child(4)").innerText.split("〜")[1] + " +0900"),
        },
        category: document.querySelector("#regist_form_wrap > section:nth-child(2) > div").innerText.match(/【.*】/)[0],
        percentOff: document.querySelector("#coupon_info > div > div.couponSubject__coupon > h2 > span").innerText,
        marketplace: marketplace,
        url: url,
    };
}
