import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, ChevronRight, Users, BookOpen, Award, GraduationCap, Stethoscope, Cpu, Leaf, Briefcase, Home } from 'lucide-react';
import './LandingPage.css';

const programs = [
  {
    id: 1,
    name: 'School of Health Sciences',
    description: 'Explore the wonders of medicine, nursing, pharmacy, and allied health professions. Our comprehensive programs prepare you for a rewarding career in healthcare.',
    duration: '4-6 Years',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    icon: Stethoscope,
    features: ['Medicine', 'Nursing', 'Pharmacy', 'Medical Lab Science']
  },
  {
    id: 2,
    name: 'School of Engineering & Technology',
    description: 'Build the future with cutting-edge programs in engineering, computer science, and information technology. Innovation starts here.',
    duration: '4-5 Years',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    icon: Cpu,
    features: ['Civil Engineering', 'Computer Science', 'Electrical Engineering', 'AI & Robotics']
  },
  {
    id: 3,
    name: 'School of Agriculture',
    description: 'Pioneer sustainable agriculture and food security. Our programs blend traditional farming with modern agricultural technology.',
    duration: '4 Years',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
    icon: Leaf,
    features: ['Agricultural Science', 'Animal Husbandry', 'Crop Science', 'Agri-Business']
  },
  {
    id: 4,
    name: 'School of Management Sciences',
    description: 'Master the art of business and leadership. Our programs develop strategic thinkers ready for the global marketplace.',
    duration: '4 Years',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
    icon: Briefcase,
    features: ['Business Administration', 'Accounting', 'Marketing', 'Human Resources']
  },
  {
    id: 5,
    name: 'School of Home Economics',
    description: 'Discover the science of living well. Our programs focus on nutrition, family studies, textiles, and consumer sciences.',
    duration: '4 Years',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    icon: Home,
    features: ['Nutrition & Dietetics', 'Family Studies', 'Textiles & Fashion', 'Hospitality Management']
  }
];

const stats = [
  { icon: Users, value: 5000, label: 'Students' },
  { icon: BookOpen, value: 50, label: 'Programs' },
  { icon: Award, value: 95, label: 'Success Rate %' },
  { icon: GraduationCap, value: 200, label: 'Faculty' }
];

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedStats(stats.map(stat => Math.min(Math.round(stat.value * (step / steps)), stat.value)));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <div className="logo-icon">E</div>
              <span className="logo-text">Excellence Academy</span>
            </Link>

            <div className="header-right">
              <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
                {navLinks.map(link => (
                  <a key={link.name} href={link.href} className="nav-link">
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="header-actions">
                <Link to="/login" className="btn btn-secondary btn-sm">Admin Login</Link>
                <Link to="/apply" className="btn btn-primary btn-sm">Apply Now</Link>
              </div>

              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Shape Your Future at Excellence Academy</h1>
            <p className="hero-subtitle">Join a community of achievers and leaders</p>
            <div className="hero-buttons">
              <Link to="/apply" className="btn btn-primary btn-lg">Apply Now</Link>
              <a href="#about" className="btn btn-secondary btn-lg">Learn More</a>
            </div>
          </motion.div>

          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <stat.icon className="stat-icon" />
                <span className="stat-value">{animatedStats[index]}+</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <motion.div 
              className="about-image"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=500&fit=crop" alt="About Us" />
              <div className="about-image-accent"></div>
            </motion.div>

            <motion.div 
              className="about-text"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>About Excellence Academy</h2>
              <p className="about-description">
                Since our founding in 1995, Excellence Academy has been committed to providing 
                world-class education that empowers students to achieve their full potential. 
                Our holistic approach combines academic excellence with character development.
              </p>
              <p className="about-description">
                We believe in nurturing critical thinking, creativity, and leadership skills 
                that prepare our graduates for the challenges of tomorrow.
              </p>

              <div className="about-features">
                <div className="feature-item">
                  <div className="feature-icon">🎓</div>
                  <div>
                    <h4>Expert Faculty</h4>
                    <p>Learn from industry leaders</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <div>
                    <h4>Legacy of Excellence</h4>
                    <p>25+ years of achievement</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌍</div>
                  <div>
                    <h4>Global Network</h4>
                    <p>Connect worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="programs-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Our Programs</h2>
            <p>Choose from our diverse range of accredited programs</p>
          </motion.div>

          <div className="programs-grid">
            {programs.map((program, index) => (
              <motion.div 
                key={program.id}
                className="program-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="program-image">
                  <img src={program.image} alt={program.name} />
                  <div className="program-overlay">
                    <span className="program-duration">{program.duration}</span>
                  </div>
                  <div className="program-icon">
                    <program.icon size={32} />
                  </div>
                </div>
                <div className="program-content">
                  <h3>{program.name}</h3>
                  <p>{program.description}</p>
                  <div className="program-features">
                    {program.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <Link to="/login" className="program-link">
                    Learn More <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Get In Touch</h2>
            <p>Have questions? We'd love to hear from you</p>
          </motion.div>

          <div className="contact-content">
            <motion.div 
              className="contact-form-wrapper"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form className="contact-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>Name</label>
                    <input type="text" placeholder="Your Name" />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" placeholder="Your Email" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="Your Phone Number" />
                </div>
                <div className="input-group">
                  <label>Message</label>
                  <textarea placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </motion.div>

            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="contact-info-item">
                <div className="contact-icon">
                  <MapPin />
                </div>
                <div>
                  <h4>Address</h4>
                  <p>123 Education Avenue<br />Knowledge City, KC 12345</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon">
                  <Phone />
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon">
                  <Mail />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>admissions@excellenceacademy.edu</p>
                </div>
              </div>

              <div className="contact-map">
                <div className="map-placeholder">
                  <MapPin size={32} />
                  <span>View on Map</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <div className="footer-logo">
                <div className="logo-icon">E</div>
                <span>Excellence Academy</span>
              </div>
              <p>Empowering the next generation of leaders through excellence in education.</p>
              <div className="social-links">
                <a href="#" className="social-link">f</a>
                <a href="#" className="social-link">t</a>
                <a href="#" className="social-link">in</a>
                <a href="#" className="social-link">ig</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#programs">Programs</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Programs</h4>
              <ul>
                <li><a href="#">Health Sciences</a></li>
                <li><a href="#">Engineering</a></li>
                <li><a href="#">Agriculture</a></li>
                <li><a href="#">Management</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul>
                <li><MapPin size={14} /> 123 Education Avenue</li>
                <li><Phone size={14} /> +1 (555) 123-4567</li>
                <li><Mail size={14} /> admissions@ea.edu</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Excellence Academy. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
