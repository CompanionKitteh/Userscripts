// ==UserScript==
// @name         Buyee Orders Expander
// @namespace    http://companionkitteh.com/
// @version      2.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Orders%20Expander.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Orders%20Expander.user.js
// @description  Automatically expand orders page
// @author       CompanionKitteh
// @match        https://buyee.jp/myshopping/orders
// @match        https://buyee.jp/myurlpurchase/orders
// @match        https://buyee.jp/myorders/bids/successful
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function clickIt() {
    document.querySelector("#more-view-button").click();
    return true;
}

waitForKeyElements("#more-view-button", clickIt);
