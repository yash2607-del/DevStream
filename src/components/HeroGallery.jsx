import { motion } from 'framer-motion';

const placeholderImages = {
  column1: [
    { id: 1, color: '#1a1a2e', label: 'IDE' },
    { id: 2, color: '#16213e', label: 'Terminal' },
    { id: 3, color: '#0f3460', label: 'GitHub' },
    { id: 4, color: '#1a1a2e', label: 'Docker' },
  ],
  column2: [
    { id: 5, color: '#2d132c', label: 'Workspace' },
    { id: 6, color: '#1f1f1f', label: 'Keyboard' },
    { id: 7, color: '#2a2a2a', label: 'Coffee' },
    { id: 8, color: '#1e1e1e', label: 'Team' },
  ],
  column3: [
    { id: 9, color: '#1a0f0f', label: 'Cir' },
    { id: 10, color: '#0f1a1a', label: 'Web' },
    { id: 11, color: '#1a1a0f', label: 'Mobile' },
    { id: 12, color: '#0f0f1a', label: 'AI/ML' },
  ],
  column4: [
    { id: 13, color: '#1e1a0f', label: 'React' },
    { id: 14, color: '#0f1e1a', label: 'Node.js' },
    { id: 15, color: '#1a0f1e', label: 'Express.js' },
    { id: 16, color: '#1a1e0f', label: 'MongoDB' },
  ],
  column5: [
    { id: 17, color: '#2a1a1a', label: 'Debug' },
    { id: 18, color: '#1a2a1a', label: 'Deploy' },
    { id: 19, color: '#1a1a2a', label: 'Testing' },
    { id: 20, color: '#2a2a1a', label: 'Scale' },
  ],
};

function HeroGallery() {
  const column1Images = [...placeholderImages.column1, ...placeholderImages.column1];
  const column2Images = [...placeholderImages.column2, ...placeholderImages.column2];
  const column3Images = [...placeholderImages.column3, ...placeholderImages.column3];
  const column4Images = [...placeholderImages.column4, ...placeholderImages.column4];
  const column5Images = [...placeholderImages.column5, ...placeholderImages.column5];

  return (
    <motion.div 
      className="hero-gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 1.5, delay: 0.3 }}
    >
      <div className="gallery-wrapper">
        {/* Column 1 - Scrolls Down */}
        <div className="gallery-column column-1">
          <div className="gallery-track track-down">
            {column1Images.map((img, index) => (
              <div 
                key={`col1-${index}`} 
                className="gallery-item"
                style={{ backgroundColor: img.color }}
              >
                <span className="placeholder-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Scrolls Up */}
        <div className="gallery-column column-2">
          <div className="gallery-track track-up">
            {column2Images.map((img, index) => (
              <div 
                key={`col2-${index}`} 
                className="gallery-item"
                style={{ backgroundColor: img.color }}
              >
                <span className="placeholder-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 - Scrolls Down */}
        <div className="gallery-column column-3">
          <div className="gallery-track track-down">
            {column3Images.map((img, index) => (
              <div 
                key={`col3-${index}`} 
                className="gallery-item"
                style={{ backgroundColor: img.color }}
              >
                <span className="placeholder-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4 - Scrolls Up */}
        <div className="gallery-column column-4">
          <div className="gallery-track track-up">
            {column4Images.map((img, index) => (
              <div 
                key={`col4-${index}`} 
                className="gallery-item"
                style={{ backgroundColor: img.color }}
              >
                <span className="placeholder-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 5 - Scrolls Down */}
        <div className="gallery-column column-5">
          <div className="gallery-track track-down">
            {column5Images.map((img, index) => (
              <div 
                key={`col5-${index}`} 
                className="gallery-item"
                style={{ backgroundColor: img.color }}
              >
                <span className="placeholder-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroGallery;
