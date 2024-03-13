// ==UserScript==
// @name         Buyee Cart Checker
// @namespace    http://companionkitteh.com/
// @version      0.2
// @description  Checks items in cart for new prices and status
// @author       CompanionKitteh
// @match        https://buyee.jp/myshopping/cart*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @grant        GM_xmlhttpRequest
// @connect      https://buyee.jp/mercari/item/*
// ==/UserScript==

(async () => {
    let cartCheckTab = '<div class="localNav__tab cartCheckTab"><a href="javascript:;">Sold Out?</a></div>';
    document.querySelector("#mypage_container > div.localNav").insertAdjacentHTML("beforeend", cartCheckTab);
    document.getElementsByClassName("cartCheckTab")[0].style.backgroundColor = "#fcc";
    document.getElementsByClassName("cartCheckTab")[0].addEventListener("click", () => { go() });
})();

async function go() {
    let cart = document.querySelector("#mypage_container > div.g-inner > div");
    let items = cart.getElementsByClassName("itemCard__itemName");
    for (let i = 0; i < items.length; i++) {
        setBackgroundColor(items[i], "#eee");
    }
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let url = item.querySelector("a").href;
        let siteHtml = await makeGetRequest(url);
        if (isSoldOutOrError(siteHtml)) {
            setBackgroundColor(item, "#fcc");
        } else {
            if (updatePrice(item, getPrices(siteHtml))) {
                setBackgroundColor(item, "#fff");
            } else {
                setBackgroundColor(item, "#dff");
            }
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

// @param element An element
// @return the element's great-great-great-great-grandparent
function getGGGGGP(element) {
    return element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
}

// @param siteHtml A page's HTML
// @return Whether or not the page is sold out or is an error page
function isSoldOutOrError(siteHtml) {
    return siteHtml.match(/this is original message|This item is sold out./);
}

// @param siteHtml A page's HTML
// @return An object containing the price information
function getPrices(siteHtml) {
    let price = siteHtml.match(/attrContainer__price[^\d]*([^<]*)/);
    let priceFx = siteHtml.match(/attrContainer__priceSmall[^(]*([^<]*)/);
    return {
        price: price === null ? "n/a" : price[1].trim(),
        priceFx: priceFx === null ? "n/a" : priceFx[1],
    };
}

// @param element An element
// @param prices An object containing the price information
// @return Whether or not the price is different
function updatePrice(element, prices) {
    let oldPrice = getGGGGGP(element).querySelector("div.itemCard__sumTotalOuter > div:nth-child(1) > span:nth-child(2)").innerHTML;
    let priceDiv = '<div class="itemCard__sumTotal itemCard__newSumTotal"> <span class="g-title">Updated total item amount</span><span class="g-price" id="total_price_n">' +
        'NEW_PRICE</span> <span class="g-priceFx" id="fx_total_price_n">NEW_PRICE_FX</span></div>';
    priceDiv = priceDiv.replace("NEW_PRICE", prices.price).replace("NEW_PRICE_FX", prices.priceFx);
    getGGGGGP(element).querySelector("div.itemCard__sumTotalOuter > div").insertAdjacentHTML("afterend", priceDiv);
    return oldPrice.slice(0, -3).trim() === prices.price.slice(0, -3).trim();
}

// @param element An element
// @param color The color to change the element's coupon box background color to
function setBackgroundColor(element, color) {
    getGGGGGP(element).style.backgroundColor = color;
}

// @param element An element
// @param color The color to change the element's coupon box border color to
function setBorderColor(element, color) {
    getGGGGGP(element).style.borderColor = color;
}
