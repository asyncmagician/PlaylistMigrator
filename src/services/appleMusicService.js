import fs from 'fs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { logError, logInfo } from '../utils/logger.js';

const teamId = process.env.APPLE_MUSIC_TEAM_ID;
const keyId = process.env.APPLE_MUSIC_KEY_ID;
const privateKeyPath = process.env.APPLE_MUSIC_PRIVATE_KEY_PATH;
const apiUrl = process.env.APPLE_MUSIC_API_URL;

const privateKey = fs.readFileSync(privateKeyPath);

function generateToken() {
    const token = jwt.sign({}, privateKey, {
        algorithm: 'ES256',
        expiresIn: '180d',
        issuer: teamId,
        header: {
            alg: 'ES256',
            kid: keyId
        }
    });
    return token;
}

const token = generateToken();

export async function createAppleMusicPlaylist(userToken, playlistName, tracks) {
    try {
        const response = await axios.post(`${apiUrl}/me/library/playlists`, {
            attributes: {
                name: playlistName
            },
            relationships: {
                tracks: {
                    data: tracks.map(trackId => ({ id: trackId, type: 'songs' }))
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Music-User-Token': userToken,
                'Content-Type': 'application/json'
            }
        });
        logInfo('Playlist created successfully on Apple Music:', response.data);
    } catch (error) {
        logError('Error creating Apple Music playlist:', error);
        if (error.response) {
            logError('Error response data:', error.response.data);
        }
    }
}

export async function searchTrackOnAppleMusic(userToken, trackTitle) {
    try {
        const response = await axios.get(`${apiUrl}/catalog/us/search`, {
            params: {
                term: trackTitle,
                types: 'songs',
                limit: 1
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Music-User-Token': userToken
            }
        });
        if (response.data.results.songs && response.data.results.songs.data.length > 0) {
            return response.data.results.songs.data[0].id;
        } else {
            return null;
        }
    } catch (error) {
        logError('Error searching track on Apple Music:', error);
        return null;
    }
}