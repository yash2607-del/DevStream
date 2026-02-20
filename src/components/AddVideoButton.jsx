import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddVideoButton = ({ onAddVideo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      await onAddVideo(url.trim());
      setUrl('');
      setIsOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Add Button */}
      <motion.button
        className="add-video-fab"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Add Video by URL"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="add-video-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="add-video-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Add Video Instantly</h3>
              <p className="modal-hint">Paste a YouTube URL right after uploading — bypasses API delay!</p>
              
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or video ID"
                  autoFocus
                  disabled={loading}
                />
                
                {error && <p className="modal-error">{error}</p>}
                
                <div className="modal-actions">
                  <button type="button" onClick={() => setIsOpen(false)} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="primary" disabled={loading || !url.trim()}>
                    {loading ? 'Adding...' : 'Add Video'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddVideoButton;
