// ==UserScript==
// @name         Mercari Comment Bringer Backer
// @namespace    http://companionkitteh.com/
// @version      1.0
// @downloadURL  https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Mercari%20Comment%20Bringer%20Backer.user.js
// @updateURL    https://github.com/CompanionKitteh/Userscripts/raw/refs/heads/main/Mercari%20Comment%20Bringer%20Backer.user.js
// @description  Shows comments on Mercari listings
// @author       CompanionKitteh
// @match        https://jp.mercari.com/item/*
// @match        https://jp.mercari.com/en/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercari.com
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==

let processed = false;
let comments;

// https://stackoverflow.com/a/29293383
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.responseURL.startsWith("https://api.mercari.jp/items/get?") && this.readyState == 4 && !processed) {
                processed = true;
                processApiResponse(this.response);
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

// @param apiReponse The response to parse
function processApiResponse(apiResponse) {
    let responseJson = JSON.parse(apiResponse);
    comments = responseJson.data.comments;
    waitForKeyElements("#item-info > section:nth-child(5)", parseComments);
}

// @param jNode The node to insert coupon information after
function parseComments(jNode) {
    let commentSection = `<h2>Comments (${comments.length})</h2><br>`;
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];
        console.log(comment);
        commentSection += `<div><h3><img src="${comment.user.photo_thumbnail_url}" style="width:32px;height:32px">` +
            `<a href="https://jp.mercari.com/en/user/profile/${comment.user.id}"> ${comment.user.name}</a></h3>` +
            `${comment.message}<br>${new Date(comment.created * 1000)}<br><br></div>`;
    }
    let template = document.createElement("template");
    template.innerHTML = commentSection;
    for (let i = template.content.children.length - 1; i >= 0; i--) {
        jNode[0].after(template.content.children[i]);
    }
}
