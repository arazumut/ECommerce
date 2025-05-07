import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

function CheckoutPage() {
  const [basketData, setBasketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    phone: '',
    notes: '',
  });
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    phone: '',
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Sepet verilerini yükleme
  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const response = await axios.get('/api/basket/');
        setBasketData(response.data);
      } catch (error) {
        console.error('Sepet bilgileri yüklenirken hata oluştu:', error);
        setError('Sepet bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchBasket();
  }, []);

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const validateAddressForm = () => {
    const errors = {};
    
    // Kargo adresi doğrulama
    if (!shippingAddress.firstName.trim()) errors.shippingFirstName = 'Ad gereklidir';
    if (!shippingAddress.lastName.trim()) errors.shippingLastName = 'Soyad gereklidir';
    if (!shippingAddress.address1.trim()) errors.shippingAddress1 = 'Adres gereklidir';
    if (!shippingAddress.city.trim()) errors.shippingCity = 'Şehir gereklidir';
    if (!shippingAddress.postcode.trim()) errors.shippingPostcode = 'Posta kodu gereklidir';
    if (!shippingAddress.phone.trim()) errors.shippingPhone = 'Telefon numarası gereklidir';
    
    // Fatura adresi doğrulama (eğer kargo adresiyle aynı değilse)
    if (!sameAsShipping) {
      if (!billingAddress.firstName.trim()) errors.billingFirstName = 'Ad gereklidir';
      if (!billingAddress.lastName.trim()) errors.billingLastName = 'Soyad gereklidir';
      if (!billingAddress.address1.trim()) errors.billingAddress1 = 'Adres gereklidir';
      if (!billingAddress.city.trim()) errors.billingCity = 'Şehir gereklidir';
      if (!billingAddress.postcode.trim()) errors.billingPostcode = 'Posta kodu gereklidir';
      if (!billingAddress.phone.trim()) errors.billingPhone = 'Telefon numarası gereklidir';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors = {};
    
    if (paymentMethod === 'credit-card') {
      if (!paymentData.cardNumber.trim()) errors.cardNumber = 'Kart numarası gereklidir';
      if (!paymentData.cardHolder.trim()) errors.cardHolder = 'Kart sahibi gereklidir';
      if (!paymentData.expiryDate.trim()) errors.expiryDate = 'Son kullanma tarihi gereklidir';
      if (!paymentData.cvv.trim()) errors.cvv = 'CVV gereklidir';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateAddressForm()) {
      // Fatura adresi kargo adresiyle aynıysa, kargo adresini kopyala
      if (sameAsShipping) {
        setBillingAddress(shippingAddress);
      }
      setCurrentStep(2);
    }
  };

  const handleBackToAddress = () => {
    setCurrentStep(1);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (validatePaymentForm()) {
      setLoading(true);
      setError('');
      try {
        // Sipariş oluştur
        const orderData = {
          shipping_address: {
            first_name: shippingAddress.firstName,
            last_name: shippingAddress.lastName,
            line1: shippingAddress.address1,
            line2: shippingAddress.address2,
            line4: shippingAddress.city,
            postcode: shippingAddress.postcode,
            phone_number: shippingAddress.phone,
            notes: shippingAddress.notes
          },
          billing_address: sameAsShipping ? null : {
            first_name: billingAddress.firstName,
            last_name: billingAddress.lastName,
            line1: billingAddress.address1,
            line2: billingAddress.address2,
            line4: billingAddress.city,
            postcode: billingAddress.postcode,
            phone_number: billingAddress.phone
          },
          payment_method: paymentMethod
        };

        const response = await axios.post('/api/checkout/', orderData);
        
        // Başarılı siparişten sonra sipariş tamamlandı sayfasına yönlendir
        navigate('/order-success', { 
          state: { 
            orderNumber: response.data.number,
            orderTotal: response.data.total_incl_tax
          } 
        });
      } catch (error) {
        console.error('Sipariş oluşturulurken hata oluştu:', error);
        setError('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !basketData) {
    return <div className="text-center p-5">Yükleniyor...</div>;
  }

  if (basketData && basketData.lines.length === 0) {
    return (
      <Container className="checkout-page py-4">
        <div className="text-center">
          <h1>Sepetiniz Boş</h1>
          <p>Ödeme yapabilmek için sepetinize ürün eklemelisiniz.</p>
          <Button variant="primary" href="/catalogue/">Alışverişe Devam Et</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="checkout-page py-4">
      <h1 className="mb-4">Ödeme</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          {currentStep === 1 ? (
            <Card className="mb-4">
              <Card.Header>
                <h2>Teslimat Adresi</h2>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleContinueToPayment}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ad</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={shippingAddress.firstName}
                          onChange={handleShippingAddressChange}
                          isInvalid={!!formErrors.shippingFirstName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.shippingFirstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Soyad</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={shippingAddress.lastName}
                          onChange={handleShippingAddressChange}
                          isInvalid={!!formErrors.shippingLastName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.shippingLastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Adres</Form.Label>
                    <Form.Control
                      type="text"
                      name="address1"
                      value={shippingAddress.address1}
                      onChange={handleShippingAddressChange}
                      isInvalid={!!formErrors.shippingAddress1}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.shippingAddress1}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Adres (devam)</Form.Label>
                    <Form.Control
                      type="text"
                      name="address2"
                      value={shippingAddress.address2}
                      onChange={handleShippingAddressChange}
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Şehir</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleShippingAddressChange}
                          isInvalid={!!formErrors.shippingCity}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.shippingCity}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Posta Kodu</Form.Label>
                        <Form.Control
                          type="text"
                          name="postcode"
                          value={shippingAddress.postcode}
                          onChange={handleShippingAddressChange}
                          isInvalid={!!formErrors.shippingPostcode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.shippingPostcode}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleShippingAddressChange}
                      isInvalid={!!formErrors.shippingPhone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.shippingPhone}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Sipariş Notu (Opsiyonel)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={shippingAddress.notes}
                      onChange={handleShippingAddressChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="same-address"
                      label="Fatura adresi teslimat adresi ile aynı"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                    />
                  </Form.Group>
                  
                  {!sameAsShipping && (
                    <div className="billing-address mb-4">
                      <h3>Fatura Adresi</h3>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ad</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={billingAddress.firstName}
                              onChange={handleBillingAddressChange}
                              isInvalid={!!formErrors.billingFirstName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.billingFirstName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Soyad</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={billingAddress.lastName}
                              onChange={handleBillingAddressChange}
                              isInvalid={!!formErrors.billingLastName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.billingLastName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Adres</Form.Label>
                        <Form.Control
                          type="text"
                          name="address1"
                          value={billingAddress.address1}
                          onChange={handleBillingAddressChange}
                          isInvalid={!!formErrors.billingAddress1}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.billingAddress1}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Adres (devam)</Form.Label>
                        <Form.Control
                          type="text"
                          name="address2"
                          value={billingAddress.address2}
                          onChange={handleBillingAddressChange}
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Şehir</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={billingAddress.city}
                              onChange={handleBillingAddressChange}
                              isInvalid={!!formErrors.billingCity}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.billingCity}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Posta Kodu</Form.Label>
                            <Form.Control
                              type="text"
                              name="postcode"
                              value={billingAddress.postcode}
                              onChange={handleBillingAddressChange}
                              isInvalid={!!formErrors.billingPostcode}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.billingPostcode}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Telefon</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={billingAddress.phone}
                          onChange={handleBillingAddressChange}
                          isInvalid={!!formErrors.billingPhone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.billingPhone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  )}
                  
                  <div className="text-end">
                    <Button type="submit" variant="primary" size="lg">
                      Ödeme Adımına Geç
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="mb-4">
              <Card.Header>
                <h2>Ödeme Bilgileri</h2>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handlePlaceOrder}>
                  <div className="mb-4">
                    <h3>Ödeme Yöntemi</h3>
                    <Form.Group>
                      <Form.Check
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        label="Kredi Kartı"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        id="bank-transfer"
                        name="paymentMethod"
                        label="Havale / EFT"
                        value="bank-transfer"
                        checked={paymentMethod === 'bank-transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  
                  {paymentMethod === 'credit-card' && (
                    <div className="payment-details mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Kart Numarası</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentDataChange}
                          isInvalid={!!formErrors.cardNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.cardNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Kart Sahibi</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardHolder"
                          placeholder="AD SOYAD"
                          value={paymentData.cardHolder}
                          onChange={handlePaymentDataChange}
                          isInvalid={!!formErrors.cardHolder}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.cardHolder}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Son Kullanma Tarihi</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={paymentData.expiryDate}
                              onChange={handlePaymentDataChange}
                              isInvalid={!!formErrors.expiryDate}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.expiryDate}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={paymentData.cvv}
                              onChange={handlePaymentDataChange}
                              isInvalid={!!formErrors.cvv}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.cvv}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                  
                  {paymentMethod === 'bank-transfer' && (
                    <div className="bank-transfer-info mb-4">
                      <Alert variant="info">
                        <h4>Banka Havalesi Bilgileri</h4>
                        <p>Siparişinizi verdikten sonra aşağıdaki banka hesaplarından birine ödeme yapabilirsiniz:</p>
                        <p>
                          <strong>Banka:</strong> ABC Bank<br />
                          <strong>Şube:</strong> Merkez<br />
                          <strong>Hesap Sahibi:</strong> E-Ticaret AŞ<br />
                          <strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00
                        </p>
                        <p>Ödemeniz onaylandıktan sonra siparişiniz hazırlanacaktır.</p>
                      </Alert>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleBackToAddress}
                    >
                      Adres Bilgilerine Dön
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      disabled={loading}
                    >
                      {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col lg={4}>
          <Card className="order-summary mb-4">
            <Card.Header>
              <h2>Sipariş Özeti</h2>
            </Card.Header>
            <ListGroup variant="flush">
              {basketData && basketData.lines.map((line) => (
                <ListGroup.Item key={line.id} className="d-flex justify-content-between">
                  <div>
                    <h6>{line.product.title}</h6>
                    <small>Adet: {line.quantity}</small>
                  </div>
                  <span>{line.price_incl_tax} TL</span>
                </ListGroup.Item>
              ))}
              
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Ara Toplam</span>
                <span>{basketData?.total_excl_tax} TL</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex justify-content-between">
                <span>KDV</span>
                <span>{basketData ? (basketData.total_incl_tax - basketData.total_excl_tax).toFixed(2) : 0} TL</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Kargo</span>
                <span>Ücretsiz</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex justify-content-between fw-bold">
                <span>Toplam</span>
                <span>{basketData?.total_incl_tax} TL</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutPage; 