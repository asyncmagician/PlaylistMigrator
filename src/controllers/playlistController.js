import { fetchYouTubePlaylistItems, fetchYouTubePlaylistDetails } from '../services/youtubeService.js';
import { getDeezerPlaylistDetails, getDeezerPlaylistTracks } from '../services/deezerService.js';
import { createAppleMusicPlaylist, searchTrackOnAppleMusic } from '../services/appleMusicService.js';
import { logError, logInfo } from '../utils/logger.js';

export async function main(service, userToken) {
    try {
        let tracks = [];
        let playlistName = '';

        if (service === 'deezer') {
            const playlistId = process.env.DEEZER_PLAYLIST_ID;
            const deezerDetails = await getDeezerPlaylistDetails(playlistId);
            playlistName = deezerDetails.title;
            tracks = await getDeezerPlaylistTracks(playlistId);
        } else if (service === 'youtube') {
            playlistName = await fetchYouTubePlaylistDetails(process.env.YOUTUBE_PLAYLIST_ID, process.env.YOUTUBE_API_KEY);
            tracks = await fetchYouTubePlaylistItems(process.env.YOUTUBE_PLAYLIST_ID, process.env.YOUTUBE_API_KEY);
        }

        const appleMusicTracks = [];
        for (const track of tracks) {
            const appleMusicTrackId = await searchTrackOnAppleMusic(userToken, track);
            if (appleMusicTrackId) {
                appleMusicTracks.push(appleMusicTrackId);
            }
        }

        if (appleMusicTracks.length > 0) {
            await createAppleMusicPlaylist(userToken, playlistName, appleMusicTracks);
            logInfo('Playlist created successfully on Apple Music!');
        } else {
            logInfo('No tracks found on Apple Music.');
        }
    } catch (error) {
        logError('Error:', error);
    }
}