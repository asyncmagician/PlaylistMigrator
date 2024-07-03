import { fetchYouTubePlaylistItems, fetchYouTubePlaylistDetails } from '../services/youtubeService.js';
import { getSpotifyUser, createSpotifyPlaylist, searchTrackOnSpotify } from '../services/spotifyService.js';
import { logError, logInfo } from '../utils/logger.js';

export async function main(spotifyAccessToken, spotifyRefreshToken) {
    try {
        const youtubePlaylistName = await fetchYouTubePlaylistDetails(process.env.YOUTUBE_PLAYLIST_ID, process.env.YOUTUBE_API_KEY);
        const youtubeTracks = await fetchYouTubePlaylistItems(process.env.YOUTUBE_PLAYLIST_ID, process.env.YOUTUBE_API_KEY);
        const spotifyTracks = [];

        for (const track of youtubeTracks) {
            const spotifyTrackUri = await searchTrackOnSpotify(spotifyAccessToken, track);
            if (spotifyTrackUri) {
                spotifyTracks.push(spotifyTrackUri);
            }
        }

        if (spotifyTracks.length > 0) {
            const user = await getSpotifyUser(spotifyAccessToken);
            await createSpotifyPlaylist(spotifyAccessToken, user.id, spotifyTracks, youtubePlaylistName);
            logInfo('Playlist created successfully on Spotify!');
        } else {
            logInfo('No tracks found on Spotify.');
        }
    } catch (error) {
        logError('Error:', error);
    }
}