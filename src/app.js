import https from 'https';
import fs from 'fs';
import express from 'express';
import open from 'open';
import dotenv from 'dotenv';
import { authenticateSpotify } from './auth/spotify/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

const options = {
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.cert')
};

app.get('/callback', authenticateSpotify);

const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&scope=playlist-modify-public%20playlist-modify-private`;

https.createServer(options, app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}. Please go to the following URL to authenticate: ${authorizeURL}`);
    open(authorizeURL);
});

export default app;