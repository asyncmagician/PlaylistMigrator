import express from 'express';
import axios from 'axios';
import { main } from '../../controllers/playlistController.js';
import { logError, logInfo } from '../../utils/logger.js';

const router = express.Router();

router.get('/login', (req, res) => {
    const deezerAuthUrl = `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}&redirect_uri=${encodeURIComponent(process.env.DEEZER_REDIRECT_URI)}&perms=basic_access,email`;
    res.redirect(deezerAuthUrl);
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.get('https://connect.deezer.com/oauth/access_token.php', {
            params: {
                app_id: process.env.DEEZER_APP_ID,
                secret: process.env.DEEZER_APP_SECRET,
                code,
                output: 'json'
            }
        });

        const deezerAccessToken = response.data.access_token;
        logInfo('Deezer token data:', response.data);

        res.send('Successfully authenticated with Deezer! You can close this window.');

        // Call main function for migration
        main(deezerAccessToken, 'deezer');
    } catch (error) {
        logError('Error during Deezer authentication:', error);
        res.send('Deezer authentication failed.');
    }
});

export default router;