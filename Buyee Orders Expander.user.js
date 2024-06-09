// ==UserScript==
// @name         Buyee Orders Expander
// @namespace    http://companionkitteh.com/
// @version      0.1
// @description  Automatically expand orders page
// @author       CompanionKitteh
// @match        https://buyee.jp/myshopping/orders*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function clickIt() {
    document.querySelector("#more-view-button").click();
    return true;
}

waitForKeyElements("#more-view-button", clickIt);