import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { YOUTUBE_CONFIG } from '../config/youtube';

gsap.registerPlugin(ScrollTrigger);

const splitRows = (videos, chunkSize = 3) => {
  const rows = [];
  for (let index = 0; index < videos.length; index += chunkSize) {
    rows.push(videos.slice(index, index + chunkSize));
  }
  return rows;
};

const VideoCard = ({ video, index, onVideoClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    // Small delay before showing preview to avoid accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    // Clear timeout if hovering ended before preview started
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Instantly stop preview
    setIsHovered(false);
  };

  return (
    <motion.div
      className="video-card"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button type="button" className="video-card-button" onClick={() => onVideoClick(video)}>
        <div className="thumbnail-wrapper">
          {isHovered ? (
            <iframe
              className="video-preview"
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0&start=0`}
              title={video.title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <img src={video.thumbnail} alt={video.title} className="thumbnail" />
          )}
          {!isHovered && <div className="duration">{video.duration}</div>}
          {!isHovered && (
            <div className="play-overlay">
              <motion.div
                className="play-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </motion.div>
            </div>
          )}
        </div>
        <div className="video-info">
          <h3 className="video-title">{video.title}</h3>
        </div>
      </button>
    </motion.div>
  );
};

// Video Row Component with GSAP horizontal scroll animation
const VideoRow = ({ videos, rowIndex, onVideoClick }) => {
  const rowRef = useRef(null);

  useEffect(() => {
    const row = rowRef.current;
    const direction = rowIndex % 2 === 0 ? -100 : 100;

    const animation = gsap.fromTo(row,
      { 
        x: direction,
        opacity: 0 
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      animation.kill();
    };
  }, [rowIndex]);

  return (
    <div ref={rowRef} className="video-row">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} onVideoClick={onVideoClick} />
      ))}
    </div>
  );
};

const VideoGrid = ({ videos = [], loading, error, onVideoClick }) => {
  const rows = splitRows(videos, 3);

  return (
    <section className="video-grid-section" id="videos">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Trending Dev Tutorials</h2>
        {YOUTUBE_CONFIG.channelUrl ? (
          <a
            className="channel-link"
            href={YOUTUBE_CONFIG.channelUrl}
            target="_blank"
            rel="noreferrer"
          >
            Visit Channel
          </a>
        ) : null}
      </motion.div>

      {loading && videos.length === 0 ? <p className="feed-message">Loading videos...</p> : null}
      {error && videos.length === 0 ? <p className="feed-message feed-error">{error}</p> : null}

      {!loading && !error && rows.length === 0 ? (
        <p className="feed-message">No videos found yet. Upload videos on your channel to populate cards.</p>
      ) : null}

      <div className="video-grid">
        {rows.map((row, rowIndex) => (
          <VideoRow key={`row-${rowIndex}`} videos={row} rowIndex={rowIndex} onVideoClick={onVideoClick} />
        ))}
      </div>
    </section>
  );
};

export default VideoGrid;
