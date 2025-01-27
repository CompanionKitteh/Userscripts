// ==UserScript==
// @name         Buyee Coupon Predictor
// @namespace    http://companionkitteh.com/
// @version      5.2
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Coupon%20Predictor.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Coupon%20Predictor.user.js
// @description  Predicts upcoming Buyee coupons
// @author       CompanionKitteh
// @match        https://buyee.jp/mycoupon/unissuedlist
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @grant        GM_xmlhttpRequest
// @connect      https://buyee.jp/coupon?code=*
// ==/UserScript==

const debug = false;

class CouponCategory {
    // @param discountId A string representing the internal discount ID (for this userscript)
    // @param discountCode A string representing the URL format of the coupon ID
    // @param marketplaceName A string representing the display name of the coupons
    // @param discounts An array of integers representing the discount values
    // @param discountType A string representing the type of discount (flat discount or percentage discount)
    // @param couponNumberPadding A number representing the length to pad the coupon number to
    // @param shouldShow A boolean representing whether or not to show the coupon
    constructor(discountId, discountCode, marketplaceName, discounts, discountType, couponNumberPadding, shouldShow) {
        this.discountId = discountId;
        this.discountCode = discountCode;
        this.marketplaceName = marketplaceName;
        this.discounts = discounts;
        this.discountType = discountType;
        this.couponNumberPadding = couponNumberPadding;
        this.shouldShow = shouldShow;
    }
}

const couponCategories = [new CouponCategory("mercariusuk_f", "mercariUSUKYYMM%%nn", "Mercari (for US and UK users)",
                                             [400, 500, 1000, 1500, 2000, 3500, 4000, 6000], "flat", 1, true),
                          new CouponCategory("mercariusuk_p", "mercariUSUKYYMM%%nn", "Mercari % (for US and UK users)",
                                             [10, 15], "percent", 2, true),
                          new CouponCategory("mercarius_f", "mercariUSYYMM%%nn", "Mercari (for US users)",
                                             [400, 500, 1000, 1500, 2000, 3500, 4000, 6000], "flat", 1, true),
                          new CouponCategory("mercarius_p", "mercariUSYYMM%%nn", "Mercari % (for US users)",
                                             [10, 15], "percent", 2, true),
                          new CouponCategory("mercarihk_f", "mercariHKYYMM%%nn", "Mercari (for HK users)",
                                             [400, 500, 1000, 1500, 2000, 3500, 4000, 6000], "flat", 1, true),
                          new CouponCategory("mercarihk_p", "mercariHKYYMM%%nn", "Mercari % (for HK users)",
                                             [10, 15], "percent", 2, true),
                          new CouponCategory("yahoojapanauction_f", "yahooauctionYYMM%%nn", "Yahoo! JAPAN Auction",
                                             [300, 800, 2000, 5000, 12000], "flat", 2, true),
                          new CouponCategory("yahoojapanauction_p", "yahooauctionYYMM%%nn", "Yahoo! JAPAN Auction %",
                                             [5, 7, 9, 10, 12, 15, 20], "percent", 2, true),
                          new CouponCategory("jdirectitemsshopping_p", "jdshoppingYYMM%%nn", "JDirect Items Shopping %",
                                             [5, 7, 10, 12, 15], "percent", 2, true),
                          new CouponCategory("rakuten_p", "rakutenYYMM%%nn", "Rakuten %",
                                             [5, 10], "percent", 2, true),
                          new CouponCategory("rakuma_p", "rakumaYYMM%%nn", "Rakuma %",
                                             [5, 8, 10], "percent", 2, true)];
const hatsuneMikuBirthday = new Date('2007-08-31');

(async () => {
    // Iterage through all categories
    for (let couponCategory of couponCategories) {
        if (!couponCategory.shouldShow && !debug) {
            continue;
        }
        let infoCoupon = `<section id="coupon_" class="mycoupon infoCoupon infoCoupon${couponCategory.discountId}"><h2 class="shopping_cart_name bg_red">` +
            `Upcoming Coupons - ${couponCategory.marketplaceName}` +
            '</h2><ul><li><div class="coupon_area"><div class="description_area"><dl><dt>' +
            'Coupon Information' +
            '</dt><dd>' +
            'No data...' +
            '</dd></dl></div><div class="information_area"><dl><dd class="bold coupon-amount">' +
            '0<span>&nbsp;FOUND</span>' +
            `</dd></dl><button type="button" class="btn btn_ok infoCouponButton infoCouponButton${couponCategory.discountId}"><i>` +
            'Search for Coupons' +
            '</i></button></div></div></li></ul></section>';
        document.querySelector("#content_inner > div > nav").insertAdjacentHTML("afterend", infoCoupon);
        document.getElementsByClassName(`infoCouponButton${couponCategory.discountId}`)[0].addEventListener("click", () => { go(couponCategory) });
    }
})();

async function go(couponCategory) {
    let coupons = [];
    // Iterate through all discounts
    for (let discountIndex = 0; discountIndex < couponCategory.discounts.length; discountIndex++) {
        let tries = 0;
        // Look for all instances of a discount
        for (let couponNumber = 1; ; couponNumber++) {
            if (tries > 2) {
                break;
            }
            updateCouponInfo(couponCategory.discountId, coupons, false);
            let url = constructCouponUrl(couponCategory, discountIndex, couponNumber);
            console.log(`Trying URL: ${url}`);
            let siteHtml = await makeGetRequest(url);
            if (!isValidResponse(siteHtml)) {
                console.log("Invalid response")
                tries++;
                continue;
            } else {
                tries = 0;
            }
            let coupon = parseCoupon(siteHtml, couponCategory, url);
            console.log(coupon);
            coupons.push(coupon);
        }
    }
    updateCouponInfo(couponCategory.discountId, coupons, true);
    console.log("Done.");
}

// @param discountId A discount ID
// @param coupons A list of coupons that have been processed so far
// @param done Whether or not all coupons have been processed
function updateCouponInfo(discountId, coupons, done) {
    let infoCoupon = document.getElementsByClassName(`infoCoupon${discountId}`)[0];
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
    let prettyPrint = `<strong>${coupon.discount}${coupon.discountType == "percent" ? "%" : ""} off `;
    if (coupon.minimum) {
        prettyPrint += `of ${coupon.minimum} `
    }
    if (coupon.category) {
        prettyPrint += `in category ${coupon.category} `
    }
    prettyPrint += `</strong><a href=${coupon.url}>[link]</a>`
    if (coupon.usagePeriod.startDate) {
        let now = new Date();
        let startDateText = `<span ${coupon.usagePeriod.startDate < now ? 'style="color:red;"' : ''}>${coupon.usagePeriod.startDate}</span>`;
        let endDateText = `<span ${coupon.usagePeriod.endDate < now ? 'style="color:red;"' : ''}>${coupon.usagePeriod.endDate}</span>`;
        prettyPrint += `<br>from ${startDateText}<br>to ${endDateText}`;
    }
    return prettyPrint;
}

// @param string A string to pad with zeroes
// @param zeroes The number of zeroes to pad the string with
// @return The zero padded string
function zeroPad(string, zeroes) {
    return ("0".repeat(zeroes) + string).slice(-zeroes);
}

// @param couponCategory A coupon category
// @param discountIndex The index of the discount
// @param couponNumber The coupon number
// @return A coupon URL of form https://buyee.jp/coupon?code=*
function constructCouponUrl(couponCategory, discountIndex, couponNumber) {
    let code = couponCategory.discountCode
            .replace("YY", zeroPad(new Date().getYear(), 2))
            .replace("MM", zeroPad(new Date().getMonth() + 1, 2))
            .replace("%%", couponCategory.discountType == "percent" ? zeroPad(couponCategory.discounts[discountIndex], 2) : couponCategory.discounts[discountIndex])
            .replace("nn", zeroPad(couponNumber, couponCategory.couponNumberPadding));
    return `https://buyee.jp/coupon?code=${code}`;
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
// @param couponCategory A coupon category
// @param url The page's URL
// @return An object containing the coupon information
function parseCoupon(siteHtml, couponCategory, url) {
    const document = new DOMParser().parseFromString(siteHtml, "text/html");
    let usagePeriodStartDate = new Date(document.querySelector(".couponDescription__period > p:nth-child(2)")?.innerText.split("〜")[0] + " +0900");
    let usagePeriodEndDate = new Date(document.querySelector(".couponDescription__period > p:nth-child(2)")?.innerText.split("〜")[1] + " +0900");
    let entryDateStartDate = new Date(document.querySelector(".couponDescription__period > p:nth-child(4)")?.innerText.split("〜")[0] + " +0900");
    let entryDateEndDate = new Date(document.querySelector(".couponDescription__period > p:nth-child(4)")?.innerText.split("〜")[1] + " +0900");
    let category = document.querySelector(".couponDescription__notice").innerText.match(/【.*】/);
    let minimum = document.querySelector(".couponDescription__notice").innerText.match(/([\d,]+ yen or more)/);
    return {
        usagePeriod: {
            startDate: usagePeriodStartDate > hatsuneMikuBirthday ? usagePeriodStartDate : null,
            endDate: usagePeriodEndDate > hatsuneMikuBirthday ? usagePeriodEndDate : null,
        },
        entryDate: {
            startDate: entryDateStartDate > hatsuneMikuBirthday ? entryDateStartDate : null,
            endDate: entryDateEndDate > hatsuneMikuBirthday ? entryDateEndDate : null,
        },
        category: category ? category[0] : null,
        minimum: minimum ? minimum[0] : null,
        discount: document.querySelector(".off_strong").innerText,
        discountId: couponCategory.discountId,
        discountCode: couponCategory.discountCode,
        discountType: couponCategory.discountType,
        url: url,
    };
}
