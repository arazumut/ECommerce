import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={6}>
            <div className="not-found-content">
              <h1 className="error-code">404</h1>
              <h2 className="error-title">Sayfa Bulunamadı</h2>
              <p className="error-message">
                Aradığınız sayfa bulunamadı. Sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
              </p>
              <div className="error-actions mt-4">
                <Button 
                  as={Link} 
                  to="/" 
                  variant="primary" 
                  className="me-3"
                >
                  <FaHome className="me-2" />
                  Ana Sayfaya Dön
                </Button>
                <Button 
                  as={Link} 
                  to="/products" 
                  variant="outline-primary"
                >
                  <FaSearch className="me-2" />
                  Ürünlere Göz At
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFoundPage; 