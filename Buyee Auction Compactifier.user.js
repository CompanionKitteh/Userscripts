// ==UserScript==
// @name         Buyee Auction Compactifier
// @namespace    http://companionkitteh.com/
// @version      1.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%Auction%Compactifier.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Buyee%Auction%Compactifier.user.js
// @description  Moves item information to a column alongside the other information
// @author       CompanionKitteh
// @match        https://buyee.jp/item/jdirectitems/auction/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyee.jp
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==

function columnify(jNode) {
    let columnDiv = document.createElement('div');
    columnDiv.style.display = 'flex';
    columnDiv.style.gap = '10px';
    document.querySelector('#content_wrap').appendChild(columnDiv);

    // Put the image section in the div
    columnDiv.appendChild(document.querySelector('#item_sec'));

    // Put the item detail section in the div
    let itemDetailData = document.querySelector('ul#itemDetail_data');
    itemDetailData.style.display = 'inline'
    let itemDetailNodeList = itemDetailData.querySelectorAll('.itemDetail__list');
    document.querySelector('li.itemDetail:nth-child(1)').append(...itemDetailNodeList);
    document.querySelector('.itemDetail').style.width = 'auto';
    columnDiv.appendChild(document.querySelector('#itemDetail_sec'));

    // Put the auction detail section in the div
    let auctionDetails = document.querySelector('.auction_order_info');
    auctionDetails.appendChild(document.querySelector('.itemSeller'));
    columnDiv.appendChild(auctionDetails);
}

waitForKeyElements('#content_wrap', columnify);
