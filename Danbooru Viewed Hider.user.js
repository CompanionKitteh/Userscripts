// ==UserScript==
// @name         Danbooru Viewed Hider
// @namespace    http://companionkitteh.com/
// @version      0.1
// @description  Hides viewed Danbooru posts
// @author       CompanionKitteh
// @match        https://danbooru.donmai.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danbooru.donmai.us
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues
// ==/UserScript==

// I don't know how GM.setValue will behave if a bunch of tabs are opened at once (race condition)
// I also don't know how persistent GM.setValue values are
// I also also don't know how the visibility toggle behaves with existing blacklists

const v = 'companionkitteh.danbooru.viewed';

(async () => {
    //GM.setValue(v, JSON.stringify(',')); // to reset viewed

    // if v doesn't exist, create it
    if (!(await GM.listValues()).includes(v)) {
        GM.setValue(v, JSON.stringify(','));
    }

    let viewed = JSON.parse(await GM.getValue(v));
    if (document.URL.includes('/posts/')) {
        // if we are viewing a post, add it to viewed
        let id = document.URL.split('/')[4];
        if (!viewed.includes(parseInt(id))) {
            viewed = viewed.concat(',' + id);
        }
        GM.setValue(v, JSON.stringify(viewed));
    } else {
        // otherwise, see if there are any posts to remove
        let posts = $('.posts-container');
        let hidden = [];
        let count = 0;
        posts.find('article').each(function (){
            let id = $(this).attr('id');
            if (viewed.includes(parseInt(id.split('_')[1]))) {
                document.getElementById(id).classList.add('blacklisted-active');
                hidden = hidden.concat(id);
                count++;
            }
        });
        if (count > 0) {
            $('#blacklist-box').attr('style', 'display: block;');
            let blacklist = $('#blacklist-list');
            blacklist.append(`<li><a href="#" id="viewed" title="viewed" class>viewed</a> <span class="count">${count}</span></li>`);
            document.getElementById('viewed').addEventListener('click', function(){
                toggleViewed(hidden);
            });
        }
    }
})();

// toggle the viewed posts
function toggleViewed(hidden) {
    let viewed = document.getElementById('viewed');
    if (viewed.classList.contains('blacklisted-inactive')) {
        // posts are visible, hide them
        viewed.classList.remove('blacklisted-inactive');
        for (let id of hidden) {
            let element = document.getElementById(id);
            if (element !== null) {
                document.getElementById(id).classList.add('blacklisted-active');
            }
        }
    } else {
        // posts are hidden, show them
        viewed.classList.add('blacklisted-inactive');
        for (let id of hidden) {
            let element = document.getElementById(id);
            if (element !== null) {
                document.getElementById(id).classList.remove('blacklisted-active');
            }
        }
    }
}