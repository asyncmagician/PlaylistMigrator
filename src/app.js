import express from 'express';
import open from 'open';
import config from './config/config.js';
import { authenticateSpotify } from './auth/spotify/auth.js';

const app = express();
const PORT = 8888;

app.get('/callback', authenticateSpotify);

app.listen(PORT, () => {
    const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${config.spotifyClientId}&response_type=code&redirect_uri=${encodeURIComponent(config.spotifyRedirectUri)}&scope=playlist-modify-public%20playlist-modify-private`;
    console.log(`Listening on port ${PORT}. Please go to the following URL to authenticate: ${authorizeURL}`);
    open(authorizeURL);
});

export default app;