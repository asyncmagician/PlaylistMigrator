import dotenv from 'dotenv';

dotenv.config();

const config = {
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    youtubePlaylistId: process.env.YOUTUBE_PLAYLIST_ID,
};

export default config;