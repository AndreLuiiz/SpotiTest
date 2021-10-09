const CLIENT_ID = '3688b6a29c6845fb836fa742df4f0eb6';
const CLIENT_SECRET = 'b435b3b39ab94c868ad5ee8b0fc42ae3';
const ID_AND_SECRET = `${CLIENT_ID}:${CLIENT_SECRET}`;
const HEADER_PARAMETER = `Basic ${btoa(ID_AND_SECRET)}`;
const URL_BASE = 'https://api.spotify.com/v1/';
let token;

// API
async function getToken() {
  const newHeaders = new Headers();
  newHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  newHeaders.append('Authorization', `${HEADER_PARAMETER}`)

  const resolve = await fetch('https://accounts.spotify.com/api/token',{
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: newHeaders,
  })
  
  await resolve.json()
    .then((result) => {
      token = result.access_token
    });
}

function getGenres() {
  const newHeaders = new Headers();
  newHeaders.append('Authorization', `Bearer ${token}`)
 
  fetch(`${URL_BASE}browse/categories?locale=pt_BR`, {
    method: 'GET',
    headers: newHeaders,
  })
  .then((response) => response.json())
  .then((response) => {buildGenresSection(response)});
}

function getPlaylist(genre) {
  const newHeaders = new Headers();
  newHeaders.append('Authorization', `Bearer ${token}`)
 
  fetch(`${URL_BASE}browse/categories/${genre}/playlists?country=BR&limit=20`, {
    method: 'GET',
    headers: newHeaders,
  })
  .then((response) => response.json())
  .then((response) => {buildPlaylistSection(response)});
}

function getTracks(url) {
  const newHeaders = new Headers();
  newHeaders.append('Authorization', `Bearer ${token}`)

  fetch (`${url}?limit=20`, {
    method: 'GET',
    headers: newHeaders
  })
  .then((response) => response.json())
  .then((response) => {buildTracksSection(response)})

}

// Build Sections
function buildGenresSection(genre) {
  const genresItems = genre.categories.items;
  
  genresItems.forEach((item) => {
    const genreSection = document.querySelector('.genres-cards')
    const genreCard = document.createElement('div')
    genreCard.addEventListener('click', genreItemsClick)
    genreCard.className = 'card';
    genreCard.id = item.id;

    const name = item.name;
    const p = document.createElement('p')
    p.innerText = name;
    
    const imgURL = item.icons[0].url;
    const img = document.createElement('img')
    img.src = imgURL;

    genreCard.appendChild(img);
    genreCard.appendChild(p);

    genreSection.appendChild(genreCard);
  })
}

function buildPlaylistSection(playlists) {
  cleanSection('playlist-cards');
  const playlistsItems = playlists.playlists.items

  playlistsItems.forEach((item) => {
    const playlistSection = document.querySelector('.playlist-cards')
    const playlistCard = document.createElement('div')
    playlistCard.addEventListener('click', (event) => playlistItemsClick(event, item.tracks.href))
    playlistCard.className = 'card';

    const name = item.name;
    const p = document.createElement('p')
    p.innerText = name;
    
    const imgURL = item.images[0].url;
    const img = document.createElement('img')
    img.src = imgURL;

    playlistCard.appendChild(img);
    playlistCard.appendChild(p);

    playlistSection.appendChild(playlistCard);
  })
}

function buildTracksSection(tracks) {
  cleanSection('text-cards');
  tracksItems = tracks.items
  console.log(tracksItems);

  tracksItems.forEach((item) => {
    const tracksSection = document.querySelector('.text-cards')
    const trackCard = document.createElement('p')
    trackCard.addEventListener('click', (event) => trackItemsClick(event.target, item.track.preview_url));
    trackCard.className = 'text-card';

    const name = item.track.name;
    trackCard.innerText = name

    tracksSection.appendChild(trackCard);
  })
}


// Dealing with events
function genreItemsClick(item) {
  const previousSelected = document.querySelector('.genre-selected')
  if (previousSelected) previousSelected.classList.remove('genre-selected')
  
  if (item.target.nodeName !== 'DIV') {
    item.target.parentNode.classList.add('genre-selected');
    window.scrollTo(0, 100)
    getPlaylist(item.target.parentNode.id);
  } else {
    item.target.classList.add('genre-selected')
    window.scrollTo(0, 100)
    getPlaylist(item.target.id);
  };
}

function playlistItemsClick(event, tracks) {
  const previousSelected = document.querySelector('.playlist-selected')
  if (previousSelected) previousSelected.classList.remove('playlist-selected')
  
  if (event.target.nodeName !== 'DIV') {
    event.target.parentNode.classList.add('playlist-selected');
  } else {
    event.target.classList.add('playlist-selected')
  };
  window.scrollTo(0, 100)

  getTracks(tracks);
}

function trackItemsClick(event, url) {
  console.log( url)
  const previousSelected = document.querySelector('.track-selected')
  if (previousSelected) previousSelected.classList.remove('track-selected');
 
  if (event.classList.contains('text-card')) {
    event.classList.add('track-selected')
  }else {
    if (event.nodeName !== 'DIV') {
      event.parentNode.classList.add('track-selected');
      window.scrollTo(0, 100)
    } else {
      event.classList.add('track-selected')
      window.scrollTo(0, 100)
    };
  }

  const audio = document.querySelector('.audio')

  audio.src = url
  audio.controls = true;
  audio.autoplay = true 

  

  window.scrollTo(0, 0)

}

function cleanSection(target) {
  const section = document.querySelector(`.${target}`)
  section.innerText =''
}

// Funções para o search

document.querySelector('.button').addEventListener('click', searchMusic);

function searchMusic() {
  const q = document.querySelector('.input').value
  
  const newHeaders = new Headers();
  newHeaders.append('Authorization', `Bearer ${token}`)
  fetch(`${URL_BASE}search?q=${q}&type=track`, {
    method: 'GET',
    headers: newHeaders
  })
  .then((response) => response.json())
  .then((response) => {showResultsOfSearch(response.tracks)})
}

function showResultsOfSearch(tracks) {
  cleanSection('parts')
  console.log(tracks);
  const tracksItems = tracks.items
  const searchSection = document.createElement('div')


  tracksItems.forEach((item) => {
    const searchCard = document.createElement('div')
    searchCard.addEventListener('click', (event) => trackItemsClick(event.target, item.preview_url));
    searchCard.classList.add('card', 'search-class');
    searchSection.classList.add('cards-with-images');

    const name = item.name;
    const p = document.createElement('p')
    p.innerText = name;
    
    const imgURL = item.album.images[0].url;
    const img = document.createElement('img')
    img.src = imgURL;

    searchCard.appendChild(img);
    searchCard.appendChild(p);
  
    searchSection.appendChild(searchCard);
    document.querySelector('.parts').appendChild(searchSection)
  })
}

// reload
document.querySelector('.title').addEventListener('click', reloadPage);
function reloadPage() {
  location.reload()
}


window.onload = async () => {
  await getToken();
  await getGenres();
}