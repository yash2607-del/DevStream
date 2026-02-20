export const YOUTUBE_CONFIG = {
  apiKey: import.meta.env.VITE_YT_API_KEY || '',
  channelId: import.meta.env.VITE_YT_CHANNEL_ID || '',
  uploadsPlaylistId: import.meta.env.VITE_YT_UPLOADS_PLAYLIST_ID || '',
  channelUrl: import.meta.env.VITE_YT_CHANNEL_URL || '',
  maxVideos: Number(import.meta.env.VITE_YT_MAX_VIDEOS || 12),
  refreshMs: Number(import.meta.env.VITE_YT_REFRESH_MS || 300000),
};

export const VIDEO_PLAY_MODE =
  import.meta.env.VITE_VIDEO_PLAY_MODE === 'embed' ? 'embed' : 'youtube';

export const hasYoutubeCredentials =
  Boolean(YOUTUBE_CONFIG.apiKey) &&
  Boolean(YOUTUBE_CONFIG.uploadsPlaylistId || YOUTUBE_CONFIG.channelId);
