"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();

    putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, displayDelBtn = false) {
    // console.debug("generateStoryMarkup", story);
    const hostName = story.getHostName();

    // shows the favorite star if user is logged in
    const favStar = Boolean(currentUser);

    return $(`
        <li id="${story.storyId}">
            ${displayDelBtn ? delBtnHtml() : ""}
            ${favStar ? favStarHtml(story, currentUser) : ""}
            <a href="${story.url}" target="a_blank" class="story-link">
                ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
        </li>
    `);
}

// Button to delete stories
function delBtnHtml() {
    return `
        <span class="trash-can">
            <i class="fas fa-trash-alt"></i>
        </span>`;
}

//turn star solid or see through fav or un fav
function favStarHtml(story, user) {
    const fav = user.isFav(story);
    const star = fav ? "fas" : "far";
    return `
        <span class="star">
            <i class="${star} fa-star"></i>
        </span>
    `;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
    console.debug("putStoriesOnPage");

    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
        const $story = generateStoryMarkup(story);
        $allStoriesList.append($story);
    }

    $allStoriesList.show();
}


function putOwnStoriesOnPage() {
    console.debug("putOwnStoriesOnPage");
    $ownStories.empty();
  
    if (currentUser.ownStories.length === 0) {
        $ownStories.append("<p>You Have Posted No Stories</p>");
    } 
    else 
    {
        for (let story of currentUser.ownStories) {
            let $story = generateStoryMarkup(story, true);
            $ownStories.append($story);
        }
    }
    $ownStories.show();
}

/* Handler for submiting the story form */
async function submitNewStory(evt) {
    console.debug("submitNewStory");
    evt.preventDefault();

    const author = $("#submit-author").val();
    const title = $("#submit-title").val();
    const url = $("#submit-url").val();
    const username = currentUser.username
    const storyData = { author, title, url, username };
    const story = await storyList.addStory(currentUser, storyData);

    const $newStory = generateStoryMarkup(story);
    $allStoriesList.prepend($newStory);
    $submitForm.hide();
    $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

async function deleteStory(evt) {
    console.debug("deleteStory");
    const $storyLi = $(evt.target).closest("li");
    const storyId = $storyLi.attr("id");
    await storyList.remStory(currentUser, storyId);
    await putStoriesOnPage();
}
$ownStories.on("click", ".trash-can", deleteStory);

function putFavListOnPage() {
    console.debug("putFavoritesListOnPage");
    $favoriteStories.empty();

    if(currentUser.favorites.length=== 0){
        $favoriteStories.append("<p>You Have No Favorites</p>")
    }
    else
    {
        for (let story of currentUser.favorites){
            const favStory = generateStoryMarkup(story);
            $favoriteStories.append(favStory)
        }
    }
    $favoriteStories.show();
}

async function toggleFav(evt){
    console.debug("toggleFav");

    const target = $(evt.target);
    const closestLi = target.closest("li");
    const storyId = closestLi.attr("id");
    const story = storyList.stories.find(function(s){
        return s.storyId === storyId
    });
    // check for fav
    if (target.hasClass("fas")){
        await currentUser.delFav(story);
        target.closest("i").toggleClass("fas far")
    }
    else{
        await currentUser.addFav(story);
        target.closest("i").toggleClass("fas far");
    }
}
$storyLists.on("click", ".star", toggleFav);

