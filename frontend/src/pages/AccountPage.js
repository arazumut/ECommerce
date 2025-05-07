import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AccountPage.css';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı bilgilerini ve siparişleri yükle
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/api/user/');
        setUser(userResponse.data);
        setProfileData({
          firstName: userResponse.data.first_name || '',
          lastName: userResponse.data.last_name || '',
          email: userResponse.data.email || '',
        });

        const ordersResponse = await axios.get('/api/orders/');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
        if (error.response?.status === 401) {
          // Kullanıcı giriş yapmamış, login sayfasına yönlendir
          navigate('/login');
        } else {
          setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileData.firstName.trim()) {
      errors.firstName = 'Ad gereklidir';
    }
    if (!profileData.lastName.trim()) {
      errors.lastName = 'Soyad gereklidir';
    }
    if (!profileData.email.trim()) {
      errors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Mevcut şifre gereklidir';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'Yeni şifre gereklidir';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Şifre en az 8 karakter olmalıdır';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (validateProfileForm()) {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        await axios.patch('/api/user/', {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
        });
        setSuccess('Profil bilgileriniz başarıyla güncellendi.');
      } catch (error) {
        console.error('Profil güncellenirken hata oluştu:', error);
        setError('Profil güncellenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        await axios.post('/api/user/change-password/', {
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        });
        setSuccess('Şifreniz başarıyla değiştirildi.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (error) {
        console.error('Şifre değiştirilirken hata oluştu:', error);
        setError('Şifre değiştirilirken bir hata oluştu. Mevcut şifrenizi kontrol edin.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-5">Yükleniyor...</div>;
  }

  return (
    <Container className="account-page py-4">
      <h1 className="mb-4">Hesabım</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tab.Container id="account-tabs" defaultActiveKey="profile">
        <Row>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profil Bilgileri</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders">Siparişlerim</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security">Güvenlik</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Card>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <h2 className="mb-4">Profil Bilgileri</h2>
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ad</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleProfileChange}
                              isInvalid={!!formErrors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.firstName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Soyad</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleProfileChange}
                              isInvalid={!!formErrors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formErrors.lastName}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>E-posta Adresi</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          isInvalid={!!formErrors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={loading}
                      >
                        {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                      </Button>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="orders">
                    <h2 className="mb-4">Siparişlerim</h2>
                    {orders.length === 0 ? (
                      <p>Henüz siparişiniz bulunmamaktadır.</p>
                    ) : (
                      orders.map(order => (
                        <Card key={order.id} className="mb-3 order-card">
                          <Card.Header>
                            <Row>
                              <Col>Sipariş #{order.number}</Col>
                              <Col className="text-end">{new Date(order.date_placed).toLocaleDateString()}</Col>
                            </Row>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col md={8}>
                                <p><strong>Durum:</strong> {order.status}</p>
                                <p><strong>Toplam:</strong> {order.total_incl_tax} TL</p>
                              </Col>
                              <Col md={4} className="text-end">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  href={`/order/${order.number}`}
                                >
                                  Detayları Görüntüle
                                </Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))
                    )}
                  </Tab.Pane>

                  <Tab.Pane eventKey="security">
                    <h2 className="mb-4">Güvenlik</h2>
                    <Form onSubmit={handlePasswordSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mevcut Şifre</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          isInvalid={!!formErrors.currentPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.currentPassword}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Yeni Şifre</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          isInvalid={!!formErrors.newPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.newPassword}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Yeni Şifre (Tekrar)</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          isInvalid={!!formErrors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={loading}
                      >
                        {loading ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
                      </Button>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default AccountPage; 