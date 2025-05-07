import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top py-5">
        <Container>
          <Row>
            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="footer-heading mb-4">Hakkımızda</h5>
              <p className="text-muted">
                Modern ve kullanıcı dostu arayüzüyle en iyi alışveriş deneyimini sunan E-Ticaret sitemize hoş geldiniz. Kaliteli ürünleri uygun fiyatlarla sizlere sunuyoruz.
              </p>
              <div className="social-icons mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FaLinkedin />
                </a>
              </div>
            </Col>
            
            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="footer-heading mb-4">Hızlı Bağlantılar</h5>
              <ul className="footer-links">
                <li><Link to="/">Ana Sayfa</Link></li>
                <li><Link to="/products">Ürünler</Link></li>
                <li><Link to="/about">Hakkımızda</Link></li>
                <li><Link to="/contact">İletişim</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </Col>
            
            <Col lg={3} md={6} className="mb-4 mb-md-0">
              <h5 className="footer-heading mb-4">Müşteri Hizmetleri</h5>
              <ul className="footer-links">
                <li><Link to="/account">Hesabım</Link></li>
                <li><Link to="/orders">Siparişleri Takip Et</Link></li>
                <li><Link to="/faq">Sık Sorulan Sorular</Link></li>
                <li><Link to="/shipping">Kargo Bilgileri</Link></li>
                <li><Link to="/returns">İade Politikası</Link></li>
              </ul>
            </Col>
            
            <Col lg={3} md={6}>
              <h5 className="footer-heading mb-4">İletişim</h5>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Merkez Mah., İstanbul Cad. No:123, İstanbul</span>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <span>+90 212 345 67 89</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>info@eticaret.com</span>
                </li>
              </ul>
              
              <h5 className="footer-heading mt-4 mb-3">Bültenimize Abone Olun</h5>
              <Form className="newsletter-form">
                <Form.Group className="d-flex">
                  <Form.Control 
                    type="email" 
                    placeholder="E-posta adresiniz" 
                    className="rounded-0 rounded-start"
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="rounded-0 rounded-end"
                  >
                    Abone Ol
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0">
                &copy; {currentYear} E-Ticaret. Tüm hakları saklıdır.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
              <div className="payment-methods">
                <img src="https://via.placeholder.com/40x25" alt="Visa" className="payment-icon" />
                <img src="https://via.placeholder.com/40x25" alt="Mastercard" className="payment-icon" />
                <img src="https://via.placeholder.com/40x25" alt="PayPal" className="payment-icon" />
                <img src="https://via.placeholder.com/40x25" alt="American Express" className="payment-icon" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 