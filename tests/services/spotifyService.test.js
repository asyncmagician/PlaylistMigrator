import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { searchTrackOnSpotify, createSpotifyPlaylist, getSpotifyUser } from '@src/services/spotifyService.js';

const mock = new MockAdapter(axios);

describe('Spotify Service', () => {
    it('should search for a track on Spotify', async () => {
        const trackTitle = 'Test Track';
        const accessToken = 'test_access_token';

        mock.onGet('https://api.spotify.com/v1/search').reply(200, {
            tracks: {
                items: [
                    {
                        uri: 'spotify:track:test_uri'
                    }
                ]
            }
        });

        const result = await searchTrackOnSpotify(accessToken, trackTitle);
        expect(result).toBe('spotify:track:test_uri');
    });

    it('should get Spotify user', async () => {
        const accessToken = 'test_access_token';

        mock.onGet('https://api.spotify.com/v1/me').reply(200, {
            id: 'test_user'
        });

        const result = await getSpotifyUser(accessToken);
        expect(result.id).toBe('test_user');
    });

    it('should create a Spotify playlist', async () => {
        const accessToken = 'test_access_token';
        const userId = 'test_user';
        const tracks = ['spotify:track:test_uri'];
        const playlistName = 'Test Playlist';

        mock.onPost(`https://api.spotify.com/v1/users/${userId}/playlists`).reply(200, {
            id: 'test_playlist_id'
        });

        mock.onPost(`https://api.spotify.com/v1/playlists/test_playlist_id/tracks`).reply(201);

        await createSpotifyPlaylist(accessToken, userId, tracks, playlistName);
    });
});