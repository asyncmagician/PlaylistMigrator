import axios from 'axios';

export async function fetchYouTubePlaylistItems(playlistId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
    const response = await axios.get(url);
    return response.data.items.map(item => item.snippet.title);
}

export async function fetchYouTubePlaylistDetails(playlistId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.items.length > 0) {
        return response.data.items[0].snippet.title;
    } else {
        throw new Error('Playlist not found');
    }
}