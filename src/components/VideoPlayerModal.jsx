import { motion } from 'framer-motion';

function VideoPlayerModal({ video, onClose }) {
  if (!video) return null;

  return (
    <div className="video-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <motion.div
        className="video-modal"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="video-modal-close" onClick={onClose} aria-label="Close player">
          ×
        </button>

        <div className="video-modal-frame-wrap">
          <iframe
            className="video-modal-frame"
            src={`${video.embedUrl}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <p className="video-modal-title">{video.title}</p>
      </motion.div>
    </div>
  );
}

export default VideoPlayerModal;
