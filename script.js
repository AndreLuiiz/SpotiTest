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
  let genres;
  const newHeaders = new Headers();
  newHeaders.append('Authorization', `Bearer ${token}`)
 
  fetch(`${URL_BASE}browse/categories?locale=pt_BR`, {
    method: 'GET',
    headers: newHeaders,
  })
  .then((response) => response.json())
  .then((response) => {buildGenresSection(response)});
}

// Build Sections
function buildGenresSection(genre) {
  const genresItems = genre.categories.items;
  
  genresItems.forEach((item) => {
    const genreSection = document.querySelector('.genres-cards')
    const genreCard = document.createElement('div')
    genreCard.addEventListener('click', genreItemsClick)
    genreCard.className = 'genre'
    
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


// Dealing with events
function genreItemsClick(item) {
  const previousSelected = document.querySelector('.genre-selected')
  if (previousSelected) previousSelected.classList.remove('genre-selected')
  
  if (item.target.nodeName !== 'DIV') {
    item.target.parentNode.classList.toggle('genre-selected');
  } else {
  item.target.classList.toggle('genre-selected')
  }

}


window.onload = async () => {
  await getToken();
  await getGenres();
}