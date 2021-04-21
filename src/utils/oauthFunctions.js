const fetch = require('node-fetch');

async function getAccessToken({ code, client_id, client_secret }) {
    const request = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code
      })
    });
    const text = await request.text();
    const params = new URLSearchParams(text);
    return params.get("access_token");
}
  
async function fetchGitHubUser(token) {
    const request = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: "token " + token
      }
    });
    return await request.json();
}

module.exports = {
    getAccessToken,
    fetchGitHubUser
}