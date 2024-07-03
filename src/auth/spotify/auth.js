import axios from 'axios';
import { main } from '../../controllers/playlistController.js';
import { logError, logInfo } from '../../utils/logger.js';

export async function authenticateSpotify(req, res) {
    const { code } = req.query;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const spotifyAccessToken = response.data.access_token;
        const spotifyRefreshToken = response.data.refresh_token;

        logInfo('Token data:', response.data);
        res.send('Successfully authenticated! You can close this window.');

        main(spotifyAccessToken, spotifyRefreshToken);
    } catch (error) {
        logError('Error during authentication:', error);
        res.send('Authentication failed.');
    }
}