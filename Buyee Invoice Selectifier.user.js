// ==UserScript==
// @name         Buyee Invoice Selectifier
// @namespace    http://companionkitteh.com/
// @version      1.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Invoice%20Selectifier.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Invoice%20Selectifier.user.js
// @description  Add searchable dropdown on invoice page
// @author       CompanionKitteh
// @match        https://buyee.jp/mybaggages/invoice
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js
// @resource     select2css https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

console.log("Buyee Invoice Selectifier is deprecated.");

/*
function select2ify(jNode) {
    jNode[0].classList.add('select2ified');
    jNode.select2({width: '100%'});
    return true;
}

GM_addStyle(GM_getResourceText('select2css'));
waitForKeyElements('[id^=invoice_itemType_]:not(.select2ified)', select2ify);
*/
