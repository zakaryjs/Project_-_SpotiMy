var element = document.getElementById('site-first-load');
let form = document.getElementById('search-bar-form');
var errorPlaceholder = "https://lastfm.freetls.fastly.net/i/u/300x300/4128a6eb29f94943c9d206c08e625904.jpg";


// event listener for the search bar which displays the searched users song data
form.addEventListener("submit", function(event) {
    // prevents default page reload
    event.preventDefault();
    // removes first load information div
    element.remove();
    // clears any data in album/song divs
    clearData();
    //
    // PLACE API KEY BELOW, BETWEEN QUOTE MARKS!
    //
    let apiKey = '';
    // assigns search bar value to newValue variable
    let newValue = ((document.getElementById('search-name').value));
    // logs search bar value to console
    console.log(newValue);
    // url to make API fetch call
    url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${newValue}&limit=1&nowplaying=true&format=json&api_key=${apiKey}`;
    // calls the useData to function in order to get and display data
    useData();
    // resets the search bar to default after submit
    form.reset();
    // checks for new data every 20 seconds
    setInterval(refreshData, 20000);
})

// async function to get the json from the url provided
let getData = async () => {
    // assigns API response to variable
    const response = await fetch(url);
    // assigns JSON to variable
    data = await response.json();
    // if the API returns an error, log the error to the console
    if (data.error) {
        errorData();
        console.log(`Uh oh! There has been error!`);
        console.log(`Error code: ${data.error}`);
        console.log(`Error message: ${data.message}`);
        return false;
    }
    // log the song info to the console
    console.log(data);
    // assign most recent song to songName variable
    songName = data.recenttracks.track[0].name;
    // assign most recent album to albumName variable
    albumName = data.recenttracks.track[0].album['#text'];
    // assign most recent artist to artistName variable
    artistName = data.recenttracks.track[0].artist['#text'];
    // assigns users total scrobble count to scrobbleCount variable
    scrobbleCount = data.recenttracks['@attr'].totalPages;
    // assigns users name to user variable
    user = data.recenttracks['@attr'].user;
    // assigns cover variable a new 'image', to which the source image is taken from the json
    cover = new Image();
    // assigns cover variable the retrieved songs cover
    cover.src = data.recenttracks.track[0].image[3]['#text'];
    // sets cover ID to coverElement
    cover.setAttribute('id', 'coverElement');
    // sets cover border
    cover.style.border = "2px solid white";
    // sets cover to be slightly rounded
    cover.style.borderRadius = "4px";
    // declares nowplaying variable and checks to see whether the nowplaying variable is true
    nowplaying = data.recenttracks.track[0]['@attr'] ? data.recenttracks.track[0]['@attr'].nowplaying : null;
    // returns song info
    return data;
}


// assigns getData function to new variable
let dataPromise = async () => {
    await getData();
} 


// async function to assign the data retrieved from the url to html elements, in order to display to user
let useData = async () => {
    // only start when the getData function has completed
    await dataPromise();
    // gets the div with the id album-cover and assigns it to a variable named coverP
    let coverP = document.getElementById('album-cover');
    // assigns the image retrieved in getData to the div with the id album-cover
    try {
        coverP.appendChild(cover);
        // makes cover clickable in order to get more information about the song
        cover.addEventListener('click', function(event) {
            window.open(data.recenttracks.track[0].url);
        })
        // changes cursor to make it appear clickable
        document.getElementById('coverElement').style.cursor = 'pointer';
        // if user is listening to current song, place text above album cover showing this
        nowPlayingP = document.getElementById('listening-now');
        if (nowplaying != null) {
            nowplayingText = document.createTextNode(`${user} is listening right now!`);
            nowPlayingP.appendChild(nowplayingText);
        }
        // gets the paragraph with the id song-name and assigns it to a variable named songP
        let songP = document.getElementById('song-name');
        // creates new text node with data from songName variable
        let songText = document.createTextNode(songName);
        // assigns songText node to the song-name paragraph
        songP.appendChild(songText);
        // gets the paragraph with the id album-name and assigns it to a variable named albumP
        let albumP = document.getElementById('album-name');
        // creates new text node with data from albumName variable
        let albumText = document.createTextNode(albumName);
        // assigns albumText node to the album-name paragraph
        albumP.appendChild(albumText);
        // gets the paragraph with the id artist-name and assigns it to a variable named artistP
        let artistP = document.getElementById('artist-name');
        // creates new text node with data from artistName variable
        let artistText = document.createTextNode(artistName);
        // assigns artistText node to the artist-name paragraph
        artistP.appendChild(artistText);
        // gets the paragraph with the id total-number-of-listens and assigns it to a variable named scrobblesP
        let scrobblesP = document.getElementById('total-number-of-listens');
        // creates new text node with data from scrobbleCount variable
        let scrobblesText = document.createTextNode(scrobbleCount);
        // assigns scrobbleText node to the total-number-of-listens paragraph
        scrobblesP.appendChild(scrobblesText);
        // gets the paragraph with the id scrobbled and assigns it to a variable named userP
        let userP = document.getElementById('scrobbled-by');
        // creates new text node with data from user variable
        let userText = document.createTextNode(user);
        // assigns userText node to the scrobbled-by paragraph 
        userP.appendChild(userText);
        } catch (error) {

    } 
}

// function to clear the data whenever new data is requested
let clearData = () => {
    document.getElementById('album-cover').innerHTML = "";
    document.getElementById('listening-now').innerHTML = "";
    document.getElementById('song-name').innerHTML = "";
    document.getElementById('album-name').innerHTML = "";
    document.getElementById('artist-name').innerHTML = "";
    document.getElementById('total-number-of-listens').innerHTML = "Total Scrobble Count: ";
    document.getElementById('scrobbled-by').innerHTML = "Scrobbled by: ";
}

// function to reload the data after a set interval, in order to check if a new song is being listened to
let refreshData = async () => {
    try {
        const newResponse = await fetch(url);
        newData = await newResponse.json();
        // if the song names do not match between new and old data, the song hasn't changed
        if (newData.recenttracks.track[0].name == data.recenttracks.track[0].name) {
        console.log('Song has not changed.');
    // else, update the data
    } else {
        clearData();
        console.log('Song changed! Updating data now...');
        useData();
    }
    } catch (error) {

    }
    
}

// function to replace album and song info divs with error placeholder data
let errorData = () => {
    nowplaying = null;
    songName = '';
    albumName = '';
    artistName = '';
    scrobbleCount = '';
    user = '';
    cover = new Image();
    cover.src = errorPlaceholder;
    cover.setAttribute('id', 'coverElement')
    cover.style.border = "2px solid white";
    cover.style.borderRadius = "4px";
    let coverP = document.getElementById('album-cover');
    coverP.appendChild(cover);
    let nowPlayingP = document.getElementById('listening-now');
    let nowplayingText = document.createTextNode("");
    nowPlayingP.appendChild(nowplayingText);
    let songP = document.getElementById('song-name');
    let songText = document.createTextNode(`Error!`);
    songP.appendChild(songText);
    let albumP = document.getElementById('album-name');
    let albumText = document.createTextNode(`${data.message}`);
    albumP.appendChild(albumText);
    let artistP = document.getElementById('artist-name');
    let artistText = document.createTextNode(`Error code: ${data.error}`);
    artistP.appendChild(artistText);
    document.getElementById('total-number-of-listens').innerHTML = "";
    document.getElementById('scrobbled-by').innerHTML = "";
}