// ==UserScript==
// @name         Buyee Cart Clicker
// @namespace    http://companionkitteh.com/
// @version      1.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Cart%20Clicker.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Cart%20Clicker.user.js
// @description  It clicks
// @author       CompanionKitteh
// @match        https://buyee.jp/myshopping/cart
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function clickIt() {
    document.querySelector("#js_load_carts").click();
    return true;
}

waitForKeyElements("#js_load_carts", clickIt);
