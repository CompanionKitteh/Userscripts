// ==UserScript==
// @name         Mercari Currency Updater
// @namespace    http://companionkitteh.com/
// @version      1.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Mercari%20Currency%20Updater.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Mercari%20Currency%20Updater.user.js
// @description  Show JPY item price
// @author       CompanionKitteh
// @match        https://jp.mercari.com/search*
// @match        https://jp.mercari.com/en/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercari.com
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==

function updateCurrency(item) {
    let info = item[0].ariaLabel.match(/([\d,]+)(yen|円)/);
    item[0].getElementsByClassName("number__6b270ca7")[0].innerHTML = info[1];
    item[0].getElementsByClassName("currency__6b270ca7")[0].innerHTML = "JPY"; // info[2]
}

waitForKeyElements(".merItemThumbnail", updateCurrency);
