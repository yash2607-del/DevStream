import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hasYoutubeCredentials, YOUTUBE_CONFIG } from '../config/youtube';
import { fetchChannelVideos, syncWithSearchAPI } from '../services/youtubeService';

export function useYoutubeVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasUsedSearchAPI = useRef(false); // Search API only on first load

  // Load videos — first load uses Search API, then RSS only
  const loadVideos = useCallback(async () => {
    if (!hasYoutubeCredentials) {
      setVideos([]);
      setError('No video has been Uploaded yet. Stay Tuned!!');
      return;
    }

    const isFirstLoad = !hasUsedSearchAPI.current;

    if (isFirstLoad) {
      setLoading(true);
    }
    setError('');

    try {
      let nextVideos = [];

      if (isFirstLoad) {
        // FIRST LOAD (browser open/refresh): Search API for fresh data
        console.log('[First Load] Using Search API for fresh data...');
        try {
          nextVideos = await syncWithSearchAPI();
          hasUsedSearchAPI.current = true;
          console.log(`[Search API] Got ${nextVideos.length} videos`);
        } catch (apiError) {
          // Search API failed (quota etc.) → fall back to RSS
          console.warn('[Search API] Failed, falling back to RSS:', apiError.message);
          nextVideos = await fetchChannelVideos();
          hasUsedSearchAPI.current = true;
        }
      } else {
        // SUBSEQUENT REFRESHES: RSS only (FREE, 0 quota)
        nextVideos = await fetchChannelVideos();
      }

      if (nextVideos.length > 0) {
        setVideos(nextVideos);
      }
    } catch (fetchError) {
      console.warn('Fetch failed:', fetchError.message);
      if (videos.length === 0) {
        setError(fetchError.message || 'Failed to load videos.');
      }
    } finally {
      setLoading(false);
    }
  }, [videos.length]);

  // Auto-refresh on interval
  useEffect(() => {
    loadVideos();

    const timer = setInterval(loadVideos, YOUTUBE_CONFIG.refreshMs);
    return () => clearInterval(timer);
  }, [loadVideos]);

  const featuredVideo = useMemo(() => videos[0] || null, [videos]);
  const gridVideos = useMemo(() => videos.slice(0, 9), [videos]);

  return {
    videos,
    featuredVideo,
    gridVideos,
    loading,
    error,
  };
}
