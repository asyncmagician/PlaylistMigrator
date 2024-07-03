import axios from 'axios';
import { logError, logInfo } from '../utils/logger.js';

export async function createSpotifyPlaylist(accessToken, userId, tracks, playlistName) {
    try {
        const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: playlistName,
            public: true
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        logInfo('Playlist data:', playlistResponse.data);

        if (tracks.length > 0) {
            await axios.post(`https://api.spotify.com/v1/playlists/${playlistResponse.data.id}/tracks`, {
                uris: tracks
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            logInfo('Tracks added to playlist.');
        } else {
            logInfo('No tracks to add to playlist.');
        }
    } catch (error) {
        logError('Error creating playlist:', error);
        if (error.response) {
            logError('Error response data:', error.response.data);
        }
    }
}

export async function getSpotifyUser(accessToken) {
    try {
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        logInfo('User data:', userResponse.data);
        return userResponse.data;
    } catch (error) {
        logError('Error getting Spotify user:', error);
        throw error;
    }
}

export async function searchTrackOnSpotify(accessToken, trackTitle) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                q: trackTitle,
                type: 'track',
                limit: 1
            }
        });
        if (response.data.tracks.items.length > 0) {
            return response.data.tracks.items[0].uri;
        } else {
            return null;
        }
    } catch (error) {
        logError('Error searching track on Spotify:', error);
        return null;
    }
}