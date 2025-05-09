import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Bu kısımda gerçek bir API çağrısı olurdu
      // const response = await fetch('/api/login/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Giriş yapılırken bir hata oluştu.');
      // }
      
      // const data = await response.json();
      // localStorage.setItem('authToken', data.token);
      
      // Şimdilik mock giriş
      if (email === 'test@example.com' && password === 'password') {
        localStorage.setItem('authToken', 'mock-auth-token');
        
        // Başarılı giriş sonrası yönlendirme
        navigate('/account');
      } else {
        setError('E-posta veya şifre hatalı.');
      }
    } catch (error) {
      setError(error.message || 'Giriş yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google ile giriş işlemleri
    alert('Google ile giriş özelliği henüz aktif değil.');
  };

  const handleFacebookLogin = () => {
    // Facebook ile giriş işlemleri
    alert('Facebook ile giriş özelliği henüz aktif değil.');
  };

  return (
    <div className="login-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="login-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">Giriş Yap</h2>
                  <p className="text-muted">Hesabınıza erişmek için giriş yapın</p>
                </div>
                
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4">
                    <div className="form-icon-wrapper">
                      <Form.Control 
                        type="email" 
                        placeholder="E-posta adresiniz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="form-icon-left">
                        <FaEnvelope />
                      </div>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <div className="form-icon-wrapper">
                      <Form.Control 
                        type="password" 
                        placeholder="Şifreniz"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="form-icon-left">
                        <FaLock />
                      </div>
                    </div>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                      type="checkbox"
                      id="rememberMe"
                      label="Beni hatırla"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}                    
                    />
                    <Link to="/forgot-password" className="forgot-password">
                      Şifremi Unuttum
                    </Link>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 mb-4"
                    disabled={loading}
                  >
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  </Button>
                  
                  <div className="text-center mb-4">
                    <p>veya sosyal medya ile giriş yap</p>
                    <div className="social-login">
                      <Button 
                        variant="outline-primary" 
                        className="social-btn me-2"
                        onClick={handleGoogleLogin}
                      >
                        <FaGoogle />
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        className="social-btn"
                        onClick={handleFacebookLogin}
                      >
                        <FaFacebook />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="mb-0">
                      Hesabınız yok mu? <Link to="/register" className="register-link">Kayıt Ol</Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4">
              <p className="text-muted">
                Test için: Email: test@example.com, Şifre: password
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage; 