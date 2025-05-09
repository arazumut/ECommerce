import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter form submitted');
    // API call for newsletter subscription
  };
  
  return (
    <footer className="site-footer">
      {/* Newsletter section */}
      <div className="footer-newsletter">
        <Container>
          <div className="newsletter-content">
            <Row className="align-items-center">
              <Col lg={6}>
                <div className="newsletter-heading">
                  <h3>Haberdar olun!</h3>
                  <p>Yeni ürünler, indirimler ve fırsatlardan ilk siz haberdar olun.</p>
                </div>
              </Col>
              <Col lg={6}>
                <Form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <div className="input-group">
                    <Form.Control
                      type="email"
                      placeholder="E-posta adresinizi girin"
                      aria-label="Newsletter"
                      required
                    />
                    <Button variant="primary" type="submit">
                      Abone Ol <FaArrowRight className="ms-2" />
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      
      {/* Main footer content */}
      <div className="footer-main">
        <Container>
          <Row className="gx-5">
            <Col lg={4} md={6} className="footer-info">
              <div className="footer-logo">
                <Link to="/" className="logo">
                  <span className="logo-blue">E</span>
                  <span className="logo-orange">-</span>
                  <span className="logo-dark">Ticaret</span>
                </Link>
              </div>
              <p className="about-text">
                Online alışverişin güvenilir adresi! Elektronik, giyim, kozmetik, ev eşyaları ve daha fazlası için doğru yerdesiniz.
              </p>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>İstanbul, Türkiye</span>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <span>+90 (212) 123 4567</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>info@eticaret.com</span>
                </li>
                <li>
                  <FaClock className="contact-icon" />
                  <span>Pazartesi - Cuma: 09:00 - 18:00</span>
                </li>
              </ul>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaLinkedinIn />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaYoutube />
                </a>
              </div>
            </Col>
            <Col lg={2} md={6} className="footer-links">
              <h4 className="footer-heading">Kategoriler</h4>
              <ul className="footer-list">
                <li><Link to="/products/electronics">Elektronik</Link></li>
                <li><Link to="/products/fashion">Moda</Link></li>
                <li><Link to="/products/home">Ev & Yaşam</Link></li>
                <li><Link to="/products/beauty">Kozmetik</Link></li>
                <li><Link to="/products/sports">Spor</Link></li>
                <li><Link to="/products/books">Kitaplar</Link></li>
                <li><Link to="/products">Tüm Kategoriler</Link></li>
              </ul>
            </Col>
            <Col lg={2} md={6} className="footer-links">
              <h4 className="footer-heading">Hesabım</h4>
              <ul className="footer-list">
                <li><Link to="/account">Hesap Bilgilerim</Link></li>
                <li><Link to="/orders">Siparişlerim</Link></li>
                <li><Link to="/wishlist">Favorilerim</Link></li>
                <li><Link to="/cart">Sepetim</Link></li>
                <li><Link to="/track-order">Sipariş Takibi</Link></li>
                <li><Link to="/returns">İade İşlemleri</Link></li>
                <li><Link to="/help">Yardım</Link></li>
              </ul>
            </Col>
            <Col lg={4} md={6} className="footer-links">
              <h4 className="footer-heading">Kurumsal</h4>
              <Row>
                <Col xs={6}>
                  <ul className="footer-list">
                    <li><Link to="/about">Hakkımızda</Link></li>
                    <li><Link to="/contact">İletişim</Link></li>
                    <li><Link to="/careers">Kariyer</Link></li>
                    <li><Link to="/stores">Mağazalarımız</Link></li>
                  </ul>
                </Col>
                <Col xs={6}>
                  <ul className="footer-list">
                    <li><Link to="/privacy-policy">Gizlilik Politikası</Link></li>
                    <li><Link to="/terms-conditions">Kullanım Koşulları</Link></li>
                    <li><Link to="/shipping-policy">Kargo Politikası</Link></li>
                    <li><Link to="/return-policy">İade Politikası</Link></li>
                  </ul>
                </Col>
              </Row>
              
              <div className="payment-methods mt-4">
                <h4 className="footer-heading">Ödeme Yöntemleri</h4>
                <div className="payment-icons">
                  <img src="https://via.placeholder.com/50x30" alt="Visa" />
                  <img src="https://via.placeholder.com/50x30" alt="Mastercard" />
                  <img src="https://via.placeholder.com/50x30" alt="American Express" />
                  <img src="https://via.placeholder.com/50x30" alt="PayPal" />
                  <img src="https://via.placeholder.com/50x30" alt="Apple Pay" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Footer bottom */}
      <div className="footer-bottom">
        <Container>
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} E-Ticaret. Tüm Hakları Saklıdır.
            </p>
            <div className="footer-bottom-links">
              <Link to="/sitemap">Site Haritası</Link>
              <Link to="/accessibility">Erişilebilirlik</Link>
              <Link to="/cookie-policy">Çerez Politikası</Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 