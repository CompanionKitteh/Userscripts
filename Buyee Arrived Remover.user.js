// ==UserScript==
// @name         Buyee Arrived Remover
// @namespace    http://companionkitteh.com/
// @version      2.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Arrived%20Remover.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%20Arrived%20Remover.user.js
// @description  Removed arrived items from orders page
// @author       CompanionKitteh
// @match        https://buyee.jp/myshopping/orders
// @match        https://buyee.jp/myurlpurchase/orders
// @match        https://buyee.jp/myorders/bids/successful
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @run-at       document-start
// ==/UserScript==

function removeIfArrived(item) {
    let progressIndex = -1;
    switch (window.location.href) {
        case "https://buyee.jp/myshopping/orders":
            progressIndex = 3;
            break;
        case "https://buyee.jp/myurlpurchase/orders":
            progressIndex = 5;
            break;
        case "https://buyee.jp/myorders/bids/successful":
            progressIndex = 2;
            break;
        default:
            progressIndex = 3;
    }
    let itemArrived = item[0].getElementsByClassName("itemCard__progressItem")[progressIndex].classList.contains("done");
    let itemCancelled = item[0].getElementsByClassName("itemCard__status")[0].innerHTML === "Cancel";
    if (itemArrived || itemCancelled) item[0].remove();
}

waitForKeyElements(".itemCard", removeIfArrived);
