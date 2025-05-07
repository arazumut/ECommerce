import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Form, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaHeart } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // API'den kategorileri getir
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/catalogue/categories/');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    };

    // Sepet durumunu kontrol et
    const checkCartStatus = async () => {
      try {
        const response = await fetch('/api/basket/');
        const data = await response.json();
        setCartCount(data.total_items || 0);
      } catch (error) {
        console.error('Sepet bilgisi alınırken hata oluştu:', error);
      }
    };

    // Kullanıcı giriş durumunu kontrol et
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    fetchCategories();
    checkCartStatus();
    checkLoginStatus();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="site-header">
      <Navbar bg="light" expand="lg" fixed="top" className="py-3 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            <span className="text-primary">E-</span>Ticaret
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="mx-2">Ana Sayfa</Nav.Link>
              
              <NavDropdown title="Kategoriler" id="categories-dropdown" className="mx-2">
                {categories.map((category) => (
                  <NavDropdown.Item 
                    as={Link} 
                    to={`/products/${category.slug}`} 
                    key={category.id}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              
              <Nav.Link as={Link} to="/products" className="mx-2">Tüm Ürünler</Nav.Link>
              <Nav.Link as={Link} to="/about" className="mx-2">Hakkımızda</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="mx-2">İletişim</Nav.Link>
            </Nav>
            
            <Form className="d-flex me-3" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Ürün ara..."
                className="me-2 rounded-pill"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-primary" type="submit" className="rounded-pill">
                <FaSearch />
              </Button>
            </Form>
            
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/cart" className="mx-2 position-relative">
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>
              
              <Nav.Link as={Link} to="/wishlist" className="mx-2">
                <FaHeart size={20} />
              </Nav.Link>
              
              {isLoggedIn ? (
                <NavDropdown title={<FaUser size={20} />} id="user-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/account">Hesabım</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders">Siparişlerim</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Çıkış Yap</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="mx-2">Giriş Yap</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 