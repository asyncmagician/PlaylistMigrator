import express from 'express';
import axios from 'axios';
import { main } from '../../controllers/playlistController.js';
import { logError, logInfo } from '../../utils/logger.js';

const router = express.Router();

router.get('/login', (req, res) => {
    const musicAuthUrl = `https://beta.music.apple.com/auth/authorize?client_id=${process.env.APPLE_MUSIC_TEAM_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.APPLE_MUSIC_REDIRECT_URI)}`;
    res.redirect(musicAuthUrl);
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.post('https://api.music.apple.com/v1/me', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.APPLE_MUSIC_REDIRECT_URI,
                client_id: process.env.APPLE_MUSIC_TEAM_ID,
                client_secret: process.env.APPLE_MUSIC_KEY_ID
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const appleMusicUserToken = response.data.access_token;
        logInfo('Apple Music token data:', response.data);

        res.send('Successfully authenticated with Apple Music! You can close this window.');

        // Call main function for migration
        main('applemusic', appleMusicUserToken);
    } catch (error) {
        logError('Error during Apple Music authentication:', error);
        res.send('Apple Music authentication failed.');
    }
});

export default router;