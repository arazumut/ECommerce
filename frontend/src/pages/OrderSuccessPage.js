import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingCart, FaUser } from 'react-icons/fa';
import './OrderSuccessPage.css';

function OrderSuccessPage() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'XXXXXX';
  const orderTotal = location.state?.orderTotal || '0.00';

  return (
    <Container className="order-success-page py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow success-card">
            <Card.Body>
              <div className="success-icon">
                <FaCheckCircle />
              </div>
              
              <h1>Siparişiniz Alındı!</h1>
              <p className="lead mb-4">
                Siparişiniz başarıyla oluşturuldu. Sipariş takibi için hesabınızı kontrol edebilirsiniz.
              </p>
              
              <Card className="order-details mb-4">
                <Card.Body>
                  <Row>
                    <Col xs={6} className="text-start">
                      <p className="mb-1"><strong>Sipariş Numarası:</strong></p>
                      <p className="order-number">{orderNumber}</p>
                    </Col>
                    <Col xs={6} className="text-end">
                      <p className="mb-1"><strong>Toplam Tutar:</strong></p>
                      <p className="order-total">{orderTotal} TL</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <p className="text-muted mb-4">
                Sipariş onayı e-posta adresinize gönderildi. Siparişinizle ilgili tüm detayları bu e-postada bulabilirsiniz.
              </p>
              
              <div className="d-grid gap-3">
                <Button as={Link} to="/account" variant="primary" className="d-flex align-items-center justify-content-center">
                  <FaUser className="me-2" /> Siparişlerime Git
                </Button>
                <Button as={Link} to="/catalogue" variant="outline-primary" className="d-flex align-items-center justify-content-center">
                  <FaShoppingCart className="me-2" /> Alışverişe Devam Et
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderSuccessPage; 