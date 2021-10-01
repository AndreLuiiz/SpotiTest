const CLIENT_ID = '3688b6a29c6845fb836fa742df4f0eb6';
const CLIENT_SECRET = 'b435b3b39ab94c868ad5ee8b0fc42ae3';
const ID_AND_SECRET = `${CLIENT_ID}:${CLIENT_SECRET}`;
const HEADER_PARAMETER = `Basic ${btoa(ID_AND_SECRET)}`;
let token;


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
      console.log(result)
      token = result.access_token
    });
}

window.onload = () => {
  getToken()
}