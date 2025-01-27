// ==UserScript==
// @name         Buyee Coupon Deletebuttonizer
// @namespace    http://companionkitteh.com/
// @version      0.1
// @description  Enables the delete button for expired coupons
// @author       CompanionKitteh
// @match        https://buyee.jp/mycoupon/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function addCouponInfo(jNode) {
    let couponNode = jNode[0];
    couponNode.classList.add('deletebuttonized');
    if (couponNode.querySelector('.couponList__status')?.innerText === 'Expired') {
        // Only expired coupons will have the delete button, but it is safer to check anyway.
        couponNode.querySelector('.delete').style = null;
    }
    return true;
}

waitForKeyElements('.eachCoupon:not(.deletebuttonized)', addCouponInfo);
