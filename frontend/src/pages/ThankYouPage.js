import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';
import './ThankYouPage.css';

const ThankYouPage = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'Sipariş Numarası';

  return (
    <Container className="thank-you-page py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center thank-you-card">
            <Card.Body>
              <div className="success-icon mb-4">
                <FaCheckCircle />
              </div>
              <h1 className="thank-you-title mb-4">Teşekkürler!</h1>
              <p className="lead mb-4">Siparişiniz başarıyla alınmıştır.</p>
              <div className="order-number-container mb-4">
                <h5>Sipariş Numaranız:</h5>
                <h3>{orderNumber}</h3>
              </div>
              <p className="mb-4">
                Siparişiniz ile ilgili bir doğrulama e-postası yakında gönderilecektir.
                Siparişinizin durumunu hesabınızdan takip edebilirsiniz.
              </p>
              <hr className="my-4" />
              <div className="action-buttons">
                <Row>
                  <Col xs={6} md={6}>
                    <Button 
                      as={Link} 
                      to="/" 
                      variant="outline-primary" 
                      className="w-100 mb-3 mb-md-0 action-button"
                    >
                      <FaHome className="mb-1 me-1" />
                      Ana Sayfaya Dön
                    </Button>
                  </Col>
                  <Col xs={6} md={6}>
                    <Button 
                      as={Link} 
                      to="/account/orders" 
                      variant="primary" 
                      className="w-100 action-button"
                    >
                      <FaShoppingBag className="mb-1 me-1" />
                      Siparişlerimi Gör
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
          
          <div className="additional-info mt-4">
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Teslimat ve İade Koşulları</h5>
                <p className="mb-1">
                  - Siparişiniz 3-5 iş günü içinde kargoya verilecektir.
                </p>
                <p className="mb-1">
                  - Ödemeniz onaylandıktan sonra siparişiniz hazırlanacaktır.
                </p>
                <p className="mb-1">
                  - Siparişlerinizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.
                </p>
                <p className="mb-0">
                  - İade koşulları hakkında daha fazla bilgi için <Link to="/return-policy">Tıklayınız</Link>.
                </p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h5 className="mb-3">Yardıma mı ihtiyacınız var?</h5>
                <p className="mb-3">
                  Siparişinizle ilgili herhangi bir sorunuz varsa, lütfen müşteri hizmetlerimizle iletişime geçin.
                </p>
                <div className="contact-methods">
                  <p className="mb-1">
                    <strong>E-posta:</strong> <a href="mailto:destek@ecommerce.com">destek@ecommerce.com</a>
                  </p>
                  <p className="mb-0">
                    <strong>Telefon:</strong> <a href="tel:+902121234567">0212 123 45 67</a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYouPage; 