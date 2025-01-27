// ==UserScript==
// @name         Buyee Coupon Informationizer
// @namespace    http://companionkitteh.com/
// @version      1.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Coupon%20Informationizer.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Coupon%20Informationizer.user.js
// @description  Updates coupons with more information
// @author       CompanionKitteh
// @match        https://buyee.jp/mycoupon/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function addCouponInfo(jNode) {
    let couponNode = jNode[0];
    couponNode.classList.add('informationized');
    couponNode.querySelector('[id^=coupon_type_text_]').innerText = couponNode.querySelector('[name=coupon_name]').value;
    return true;
}

waitForKeyElements('.eachCoupon:not(.informationized)', addCouponInfo);
