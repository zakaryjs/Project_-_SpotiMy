var url = null;

let form = document.getElementById('search-bar-form');

form.addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById('album-cover').innerHTML = "";
    document.getElementById('song-name').innerHTML = "";
    document.getElementById('album-name').innerHTML = "";
    document.getElementById('artist-name').innerHTML = "";
    document.getElementById('total-number-of-listens').innerHTML = "Total Scrobble Count: ";
    document.getElementById('scrobbled-by').innerHTML = "Scrobbled by: ";
    let newValue = ((document.getElementById('search-name').value));
    console.log(newValue);
    url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${newValue}&api_key=&limit=1&nowplaying=true&format=json`;
    useData();
    form.reset();
})

function logInput () {
    let newValue = ((document.getElementById('search-name').value));
    console.log(newValue);
}

// async function to get the json from the url provided
let getData = async () => {
    const response = await fetch(url);
    data = await response.json();
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
    cover.src = data.recenttracks.track[0].image[3]['#text'];
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
    coverP.appendChild(cover);
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
}

// call the useData function
// useData()