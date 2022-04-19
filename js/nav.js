"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
    console.debug("navAllStories", evt);
    hidePageComponents();
    putStoriesOnPage();
}

$navAll.on("click", navAllStories);

function navSubmitClick(evt) {
    console.debug("navSubmitClick", evt);
    hidePageComponents();
    $allStoriesList.show();
    $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

function navFavClick(evt){
    console.debug("navfavClick", evt);
    hidePageComponents();
    putFavListOnPage();
}
$navFav.on("click", navFavClick);

function navMyStoriesClick(evt) {
    console.debug("navMyStories", evt);
    hidePageComponents();
    putOwnStoriesOnPage();
    $ownStories.show();
}

$navMine.on("click", navMyStoriesClick);
/** Show login/signup on click on "login" */

function navLoginClick(evt) {
    console.debug("navLoginClick", evt);
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
    console.debug("updateNavOnLogin");
    $(".main-nav-links").show();
    $navLogin.hide();
    $navLogOut.show();
    $navUserProfile.text(`${currentUser.username}`).show();
}
