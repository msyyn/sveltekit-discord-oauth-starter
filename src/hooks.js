import cookie from 'cookie';
const DISCORD_API_URL = import.meta.env.VITE_DISCORD_API_URL;
const HOST = import.meta.env.VITE_HOST;

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(req) {
  const cookies = cookie.parse(req.headers.cookie || '');

  // if only refresh token is found, then access token has expired. perform a refresh on it.
  if (cookies.disco_refresh_token && !cookies.disco_access_token) {
    const discord_request = await fetch(`${HOST}/api/refresh?code=${cookies.disco_refresh_token}`);
    const discord_response = await discord_request.json();

    if (discord_response.disco_access_token) {
      console.log('setting discord user via refresh token..')
      const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
        headers: { 'Authorization': `Bearer ${discord_response.disco_access_token}` }
      });
  
      // returns a discord user if JWT was valid
      const response = await request.json();
  
      if (response.id) {
        return {
          user: {
            // only include properties needed client-side —
            // exclude anything else attached to the user
            // like access tokens etc
            ...response
          }
        }
      }
    }
  }

  if (cookies.disco_access_token) {
    console.log('setting discord user via access token..')
    const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: { 'Authorization': `Bearer ${cookies.disco_access_token}`}
    });

    // returns a discord user if JWT was valid
    const response = await request.json();

    if (response.id) {
      return {
        user: {
          // only include properties needed client-side —
          // exclude anything else attached to the user
          // like access tokens etc
          ...response
        }
      }
    }
  }

  // not authenticated, return empty user object
  return {
    user: false
  }
}