// ==UserScript==
// @name         Buyee Cart Checker
// @namespace    http://companionkitteh.com/
// @version      0.1
// @description  Checks for sold out items in cart
// @author       CompanionKitteh
// @match        https://buyee.jp/myshopping/cart*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @grant        GM_xmlhttpRequest
// @connect      https://buyee.jp/mercari/item/*
// ==/UserScript==

(async () => {
    let cartCheckTab = '<div class="localNav__tab cartCheckTab"><a href="javascript:;">Sold Out?</a></div>';
    document.querySelector("#mypage_container > div.localNav").insertAdjacentHTML("beforeend", cartCheckTab);
    document.getElementsByClassName("cartCheckTab")[0].style.backgroundColor = "pink";
    document.getElementsByClassName("cartCheckTab")[0].addEventListener("click", () => { go() });
})();

async function go() {
    let cart = document.querySelector("#mypage_container > div.g-inner > div");
    let items = cart.getElementsByClassName("itemCard__itemName");
    for (let i = 0; i < items.length; i++) {
        setGGGGGPBackgroundColor(items[i], "#eee");
    }
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let url = item.querySelector("a").href;
        let siteHtml = await makeGetRequest(url);
        if (isSoldOutOrError(siteHtml)) {
            setGGGGGPBackgroundColor(item, "pink");
        } else {
            setGGGGGPBackgroundColor(item, "white");
        }
    }
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
// @return Whether or not the page is sold out or is an error page
function isSoldOutOrError(siteHtml) {
    return siteHtml.match(/this is original message|This item is sold out./);
}

// @param element An element
// @param color The color to change the element's great-great-great-great-grandparent's background color to
function setGGGGGPBackgroundColor(element, color) {
    element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.backgroundColor = color;
}