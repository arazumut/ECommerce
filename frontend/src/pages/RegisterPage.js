import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }

    if (!formData.password1) {
      newErrors.password1 = 'Şifre gereklidir';
    } else if (formData.password1.length < 8) {
      newErrors.password1 = 'Şifre en az 8 karakter olmalıdır';
    }

    if (formData.password1 !== formData.password2) {
      newErrors.password2 = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.email.split('@')[0])
    if (validateForm()) {
      setLoading(true);
      setServerError('');
      try {
        // API'ye kayıt isteği
        await axios.post('/api/register/', {
          username: formData.email.split('@')[0],
          email: formData.email,
          password: formData.password1,
          password2: 
          first_name: formData.firstName,
          last_name: formData.lastName,
        });
        
        // Başarılı kayıt sonrası giriş sayfasına yönlendirme
        navigate('/login');
      } catch (error) {
        console.error('Kayıt hatası:', error);
        setServerError(
          error.response?.data?.message || 
          'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="register-page">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div className="register-form-container">
            <h1>Hesap Oluştur</h1>
            {serverError && <Alert variant="danger">{serverError}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>E-posta Adresi</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Ad</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Soyad</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Şifre</Form.Label>
                <Form.Control
                  type="password"
                  name="password1"
                  value={formData.password1}
                  onChange={handleChange}
                  isInvalid={!!errors.password1}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password1}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Şifre (Tekrar)</Form.Label>
                <Form.Control
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  isInvalid={!!errors.password2}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password2}
                </Form.Control.Feedback>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100" 
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
              </Button>
            </Form>
            <div className="mt-3 text-center">
              Zaten bir hesabınız var mı? <Link to="/login">Giriş yapın</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage; 