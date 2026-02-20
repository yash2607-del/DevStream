# DevStream Homepage

This project is a Vite + React homepage that now pulls videos directly from your YouTube channel.

## What is implemented

- Video cards are fetched from your channel uploads using YouTube Data API v3.
- Featured video section is auto-filled from the latest visible upload.
- If a video is deleted/private in YouTube Studio, it is filtered out and card disappears on next refresh.


## Setup

1. Create a Google Cloud project.
2. Enable **YouTube Data API v3**.
3. Create an API key.
4. Create `.env` and fill your values.
5. Run `npm install` then `npm run dev`.

## Environment variables

- `VITE_YT_API_KEY`: YouTube Data API key.
- `VITE_YT_CHANNEL_ID`: Your channel ID (`UC...`).
- `VITE_YT_UPLOADS_PLAYLIST_ID`: Optional; if present, this is used directly instead of channel ID lookup.
- `VITE_YT_CHANNEL_URL`: Channel hyperlink shown in the videos section.
- `VITE_YT_MAX_VIDEOS`: Number of recent uploads to pull (max 50 per API call).
- `VITE_YT_REFRESH_MS`: Auto-refresh interval in milliseconds.
- `VITE_VIDEO_PLAY_MODE`: `embed` or `youtube`.


