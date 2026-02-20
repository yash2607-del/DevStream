import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BestVideo = ({ video, onVideoClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!video) {
    return (
      <section className="best-video-section" id="featured" ref={ref}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Editor's Pick</h2>
        </motion.div>
        <p className="feed-message">No featured video yet. Upload videos on your channel to auto-fill this section.</p>
      </section>
    );
  }

  const highlights = [
    `Published: ${new Date(video.publishedAt || Date.now()).toLocaleDateString()}`,
  ];

  return (
    <section className="best-video-section" id="featured" ref={ref}>
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Editor's Pick</h2>
      </motion.div>

      <div className="best-video-container">
        <motion.div 
          className="best-video-card"
          initial={{ opacity: 0, x: -80, rotateY: -15 }}
          animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <button type="button" className="best-thumbnail-wrapper" onClick={() => onVideoClick(video)}>
            <img src={video.thumbnail} alt={video.title} className="best-thumbnail" />
            <div className="best-duration">{video.duration}</div>
            <div className="best-play-overlay">
              <motion.div
                className="best-play-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </motion.div>
            </div>
            <div className="best-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Best Pick
            </div>
          </button>
        </motion.div>

        <motion.div 
          className="best-video-content"
          initial={{ opacity: 0, x: 80 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className="best-video-title">{video.title}</h3>

          <p className="best-video-description">{video.description || 'Watch the latest featured upload from your channel.'}</p>
          <div className="highlights">
            {highlights.map((item, index) => (
              <motion.div 
                key={index} 
                className="highlight-item"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {item}
              </motion.div>
            ))}
          </div>
          <motion.button 
            className="watch-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onVideoClick(video)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Watch Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BestVideo;
