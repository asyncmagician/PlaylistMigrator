import axios from 'axios';
import { logError, logInfo } from '../utils/logger.js';

export async function getDeezerPlaylistDetails(playlistId) {
    try {
        const response = await axios.get(`https://api.deezer.com/playlist/${playlistId}`);
        return response.data;
    } catch (error) {
        logError('Error fetching Deezer playlist details:', error);
        throw error;
    }
}

export async function getDeezerPlaylistTracks(playlistId) {
    try {
        const response = await axios.get(`https://api.deezer.com/playlist/${playlistId}/tracks`);
        return response.data.data.map(track => track.title);
    } catch (error) {
        logError('Error fetching Deezer playlist tracks:', error);
        throw error;
    }
}