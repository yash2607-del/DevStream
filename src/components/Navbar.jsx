import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      className="nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <a href="#" className="nav-link">Home</a>
      <a href="#videos" className="nav-link">Videos</a>
      <a href="#featured" className="nav-link">Featured</a>
    </motion.nav>
  );
};

export default Navbar;
