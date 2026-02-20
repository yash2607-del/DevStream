import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar, Footer, VideoGrid, HeroGallery, VideoPlayerModal } from '../components';
import { useYoutubeVideos } from '../hooks/useYoutubeVideos';
import { VIDEO_PLAY_MODE } from '../config/youtube';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const featuredContentRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { gridVideos, loading, error } = useYoutubeVideos();

  useEffect(() => {
    const heroContent = document.querySelector('.hero-content');
    
    // Reset to full opacity first
    gsap.set(heroContent, { opacity: 1, y: 0 });
    
    gsap.to(heroContent, {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '50% top',
        scrub: 0.5,
      }
    });

    // Featured section horizontal scroll animation
    if (featuredRef.current && featuredContentRef.current) {
      gsap.fromTo(featuredContentRef.current, 
        { x: '30%', opacity: 0 },
        {
          x: '-20%',
          opacity: 1,
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleVideoClick = (video) => {
    if (!video) return;

    if (VIDEO_PLAY_MODE === 'embed') {
      setSelectedVideo(video);
      return;
    }

    window.open(video.youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="home">
      {/* Hero Section with Nav */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>

        {/* Logo - Top Left */}
        <motion.a 
          href="#" 
          className="hero-brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="brand-icon">▶</span>
          <span className="brand-name">DevStream</span>
        </motion.a>
        
        <Navbar />

        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Empowering the Next
            <br />
            Generation of <span className="highlight">Developers</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Learn from best web devloper tutorial — where code meets creativity.
          </motion.p>
        </div>

        {/* Tilted Gallery */}
        <HeroGallery />

        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <span>Scroll to Explore</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </motion.div>
      </section>

      <VideoGrid videos={gridVideos} loading={loading} error={error} onVideoClick={handleVideoClick} />

      {/* Featured Video Section - Horizontal Scroll Animation */}
      <section id="featured" className="featured-section" ref={featuredRef}>
        <div className="featured-content" ref={featuredContentRef}>
          <div className="featured-header">
            <span className="featured-badge">Featured</span>
            <h2 className="featured-title">Tailwind CSS Basics</h2>
            <p className="featured-description">Get started with Tailwind CSS v4.0 - the utility-first CSS framework</p>
          </div>
          
          <div className="featured-video-container">
            <div className="featured-video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/TaXQV_SI8Y0?rel=0"
                title="Tailwind CSS Basics"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {VIDEO_PLAY_MODE === 'embed' ? (
        <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      ) : null}
    </div>
  );
}

export default Home;