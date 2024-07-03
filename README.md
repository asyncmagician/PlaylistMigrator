# PlaylistMigrator

PlaylistMigrator is a tool to migrate playlists from YouTube to Spotify.

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- A Spotify Developer account
- A Google Developer account (for YouTube API)
- OpenSSL to generate SSL certificates

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/asyncmagician/PlaylistMigrator.git
cd PlaylistMigrator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API Keys

#### Spotify

1.	Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2.	Create a new application.
3.	Copy the Client ID and Client Secret.
4. Add https://localhost:8889/callback to the Redirect URIs. 

#### YouTube

1.	Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.	Create a new project.
3.	Enable the YouTube Data API v3 for this project.
4.	Create API credentials and copy the API key.

### 4. Generate SSL keys with OpenSSL

```bash
mkdir certs 
openssl req -newkey rsa:2048 -nodes -keyout certs/server.key -x509 -days 365 -out certs/server.cert
```

### 5. Configure the .env file

Create a .env file at the root of the project and add the following information:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://localhost:8889/callback
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_PLAYLIST_ID=your_youtube_playlist_id
```

### 6. Start the server

```bash
npm start
```

### 7. Authenticate with Spotify

When you start the server, an authorization URL for Spotify will automatically open in your browser. Log in and authorize the application to access your Spotify data. After authentication, the playlist migration will start automatically


### License
This project is licensed under the GPL-3.0 License. See the `./LICENSE` for more information.
