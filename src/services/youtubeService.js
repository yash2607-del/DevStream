import { YOUTUBE_CONFIG } from '../config/youtube';

const API_BASE = 'https://www.googleapis.com/youtube/v3';
// Multiple CORS proxies for fallback
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];

const formatViews = (value) => {
  const count = Number(value || 0);
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return `${count}`;
};

const formatDuration = (isoDuration) => {
  if (!isoDuration) return '';
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

// HTML entity decoder for RSS titles
const decodeHtmlEntities = (text) => {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Fetch with timeout
const fetchWithTimeout = async (url, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
};

// ─── RSS FETCH (FREE — used for auto-refresh after first load) ───────────────
// Returns complete video objects from RSS feed (title, thumbnail, views, date)
export const fetchChannelVideos = async () => {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CONFIG.channelId}`;
  
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetchWithTimeout(`${proxy}${encodeURIComponent(rssUrl)}`, 6000);
      if (!response.ok) continue;
      
      const xmlText = await response.text();
      
      const videos = [];
      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
      let entryMatch;
      
      while ((entryMatch = entryRegex.exec(xmlText)) !== null) {
        const entry = entryMatch[1];
        
        const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
        const title = entry.match(/<media:title>([^<]+)<\/media:title>/)?.[1] 
                   || entry.match(/<title>([^<]+)<\/title>/)?.[1];
        const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1];
        const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
        const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1];
        const views = entry.match(/<media:statistics views="(\d+)"/)?.[1];
        const channelName = entry.match(/<name>([^<]+)<\/name>/)?.[1];
        
        if (videoId) {
          videos.push({
            id: videoId,
            title: decodeHtmlEntities(title) || 'Untitled Video',
            channel: channelName || 'YouTube Channel',
            views: formatViews(views),
            duration: '',
            thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            description: decodeHtmlEntities(description) || '',
            publishedAt: published || null,
            youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            isVisible: true,
          });
        }
      }
      
      console.log(`[RSS] Found ${videos.length} videos (FREE)`);

      // Sort by oldest first
      videos.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

      if (videos.length > 0) return videos;
    } catch (err) {
      console.warn(`[RSS] Proxy ${proxy} failed:`, err.message);
    }
  }
  return [];
};

// ─── SEARCH API SYNC (used ONCE on page load/refresh) ────────────────────────
// Fetches latest videos via Search API (~101 quota units total)
// Detects new uploads AND deletions instantly
export const syncWithSearchAPI = async () => {
  const params = new URLSearchParams({
    part: 'snippet',
    channelId: YOUTUBE_CONFIG.channelId,
    order: 'date',
    type: 'video',
    maxResults: '15',
    key: YOUTUBE_CONFIG.apiKey,
  });

  const response = await fetch(`${API_BASE}/search?${params.toString()}`);
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('API quota exceeded. Using RSS fallback.');
    }
    throw new Error('Search API request failed.');
  }

  const data = await response.json();
  const videoIds = (data.items || [])
    .map((item) => item?.id?.videoId)
    .filter(Boolean);

  if (!videoIds.length) return [];

  // Fetch full details (1 quota unit for the whole batch)
  const detailsParams = new URLSearchParams({
    part: 'contentDetails,statistics,snippet,status',
    id: videoIds.join(','),
    key: YOUTUBE_CONFIG.apiKey,
  });

  const detailsResponse = await fetch(`${API_BASE}/videos?${detailsParams.toString()}`);
  if (!detailsResponse.ok) {
    if (detailsResponse.status === 403) {
      throw new Error('API quota exceeded. Using RSS fallback.');
    }
    throw new Error('Failed to fetch video details.');
  }

  const detailsData = await detailsResponse.json();
  const videos = (detailsData.items || [])
    .map((item) => {
      const snippet = item.snippet || {};
      const status = item.status;

      if (
        status?.privacyStatus === 'private' ||
        snippet.title === 'Deleted video' ||
        snippet.title === 'Private video'
      ) {
        return null;
      }

      return {
        id: item.id,
        title: snippet.title || 'Untitled Video',
        channel: snippet.channelTitle || 'YouTube Channel',
        views: formatViews(item.statistics?.viewCount),
        duration: formatDuration(item.contentDetails?.duration),
        thumbnail:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || null,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
        embedUrl: `https://www.youtube.com/embed/${item.id}`,
        isVisible: true,
      };
    })
    .filter(Boolean);

  // Sort oldest first
  videos.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

  console.log(`[Search API] Synced ${videos.length} videos (~101 quota units used)`);
  return videos;
};
