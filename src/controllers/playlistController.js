import { fetchYouTubePlaylistItems, fetchYouTubePlaylistDetails } from '../services/youtubeService.js';
import { getSpotifyUser, createSpotifyPlaylist, searchTrackOnSpotify } from '../services/spotifyService.js';
import { getDeezerPlaylistDetails, getDeezerPlaylistTracks } from '../services/deezerService.js';
import { logError, logInfo } from '../utils/logger.js';

export async function main(accessToken, service) {
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

        const spotifyTracks = [];
        for (const track of tracks) {
            const spotifyTrackUri = await searchTrackOnSpotify(accessToken, track);
            if (spotifyTrackUri) {
                spotifyTracks.push(spotifyTrackUri);
            }
        }

        if (spotifyTracks.length > 0) {
            const user = await getSpotifyUser(accessToken);
            await createSpotifyPlaylist(accessToken, user.id, spotifyTracks, playlistName);
            logInfo('Playlist created successfully on Spotify!');
        } else {
            logInfo('No tracks found on Spotify.');
        }
    } catch (error) {
        logError('Error:', error);
    }
}