// ==UserScript==
// @name         Buyee Arrived Remover
// @namespace    http://companionkitteh.com/
// @version      0.1
// @description  Removed arrived items from orders page
// @author       CompanionKitteh
// @match        https://buyee.jp/myshopping/orders*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @run-at       document-start
// ==/UserScript==

function removeIfArrived(item) {
    let itemArrived = item[0].getElementsByClassName("itemCard__progressItem")[3].classList.contains("done");
    let itemCancelled = item[0].getElementsByClassName("itemCard__status")[0].innerHTML === "Cancel";
    if (itemArrived || itemCancelled) item[0].remove();
}

waitForKeyElements(".itemCard", removeIfArrived);