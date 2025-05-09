import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Form, Button, Badge, Offcanvas } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaHeart, FaRegBell, FaBars } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kategori verilerini getir
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

    // Sayfa yüklendiğinde veya rota değiştiğinde offcanvas'ı kapat
    setShowOffcanvas(false);
    
    // Scroll izleyici
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Demo bildirimler
    setNotifications([
      { id: 1, text: 'Siparişiniz onaylandı', date: '1 saat önce', read: false },
      { id: 2, text: 'İndirim fırsatı: %20 indirim kuponu', date: '1 gün önce', read: true },
      { id: 3, text: 'Beğendiğiniz ürün tekrar stokta', date: '2 gün önce', read: true }
    ]);
    
    // Temizleme
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    // Arama açıldığında input'a odaklanma
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleOffcanvasToggle = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Okunmamış bildirim sayısını hesapla
  const unreadNotifications = notifications.filter(notification => !notification.read).length;

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Üst bilgi çubuğu */}
      <div className="top-bar">
        <Container>
          <div className="top-bar-content">
            <div className="top-bar-left">
              <div className="info-item">
                <span>Hızlı Teslimat</span>
              </div>
              <div className="info-item">
                <span>Ücretsiz Kargo: 300 TL Üzeri</span>
              </div>
            </div>
            <div className="top-bar-right">
              <div className="info-item">
                <Link to="/track-order">Sipariş Takibi</Link>
              </div>
              <div className="info-item">
                <Link to="/contact">İletişim</Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Ana navigasyon */}
      <Navbar 
        bg="light" 
        expand="lg" 
        className={`main-navbar py-3 ${scrolled ? 'shadow-sm navbar-sticky' : ''}`}
      >
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="brand">
            <span className="brand-blue">E</span>
            <span className="brand-orange">-</span>
            <span className="brand-dark">Ticaret</span>
          </Navbar.Brand>
          
          {/* Mobil için menü butonu */}
          <div className="d-flex d-lg-none mobile-actions">
            <Button 
              variant="link" 
              className="action-icon"
              onClick={handleSearchToggle}
            >
              <FaSearch />
            </Button>
            <Button 
              variant="link" 
              className="action-icon position-relative"
              as={Link} 
              to="/cart"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button 
              variant="link" 
              className="action-icon"
              onClick={handleOffcanvasToggle}
            >
              <FaBars />
            </Button>
          </div>
          
          {/* Desktop navigasyon */}
          <div className="d-none d-lg-flex flex-grow-1 main-nav-container">
            {/* Ana menü */}
            <Nav className="main-menu mx-auto">
              <Nav.Link as={Link} to="/" className="nav-item mx-2">Ana Sayfa</Nav.Link>
              
              <NavDropdown title="Kategoriler" id="categories-dropdown" className="nav-item mx-2">
                {categories.map((category) => (
                  <NavDropdown.Item 
                    as={Link} 
                    to={`/products/${category.slug}`} 
                    key={category.id}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/products">Tüm Ürünler</NavDropdown.Item>
              </NavDropdown>
              
              <Nav.Link as={Link} to="/products/featured" className="nav-item mx-2">Öne Çıkanlar</Nav.Link>
              <Nav.Link as={Link} to="/products/new" className="nav-item mx-2">Yeni Gelenler</Nav.Link>
              <Nav.Link as={Link} to="/products/sale" className="nav-item mx-2">İndirimli Ürünler</Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-item mx-2">Hakkımızda</Nav.Link>
            </Nav>
            
            {/* Sağ menü */}
            <div className="header-actions">
              <Button 
                variant="link" 
                className="action-icon"
                onClick={handleSearchToggle}
              >
                <FaSearch />
              </Button>
              
              <Button 
                variant="link" 
                className="action-icon position-relative"
                as={Link} 
                to="/wishlist"
              >
                <FaHeart />
              </Button>
              
              <Button 
                variant="link" 
                className="action-icon position-relative"
              >
                <FaRegBell />
                {unreadNotifications > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="link" 
                className="action-icon position-relative"
                as={Link} 
                to="/cart"
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              
              {isLoggedIn ? (
                <NavDropdown 
                  title={<FaUser className="user-icon" />} 
                  id="user-dropdown" 
                  align="end"
                  className="user-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/account">Hesabım</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders">Siparişlerim</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/wishlist">Favorilerim</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Çıkış Yap</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button 
                  variant="link"
                  className="login-btn"
                  as={Link} 
                  to="/login"
                >
                  <FaUser className="me-2" />
                  <span>Giriş Yap</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Arama çubuğu */}
          <div className={`search-bar ${showSearch ? 'active' : ''}`}>
            <Container>
              <Form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                  <input
                    type="search"
                    placeholder="Ne aramıştınız?"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ref={searchInputRef}
                  />
                  <Button variant="primary" type="submit" className="search-button">
                    <FaSearch />
                  </Button>
                </div>
                <Button 
                  variant="link" 
                  className="search-close" 
                  onClick={handleSearchToggle}
                >
                  İptal
                </Button>
              </Form>
            </Container>
          </div>
        </Container>
      </Navbar>
      
      {/* Mobil menü - Offcanvas */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        className="mobile-menu"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menü</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mobile-nav">
            {/* Kullanıcı alanı */}
            <div className="mobile-user-area">
              {isLoggedIn ? (
                <>
                  <div className="user-welcome">
                    <FaUser className="user-icon" />
                    <div className="user-info">
                      <div className="welcome-text">Hoş geldiniz</div>
                      <Link to="/account" className="user-name">Hesabım</Link>
                    </div>
                  </div>
                  <div className="mobile-actions-row">
                    <Link to="/account" className="mobile-action-item">
                      <span>Hesabım</span>
                    </Link>
                    <Link to="/orders" className="mobile-action-item">
                      <span>Siparişlerim</span>
                    </Link>
                    <Link to="/wishlist" className="mobile-action-item">
                      <span>Favorilerim</span>
                    </Link>
                    <Button 
                      variant="link" 
                      className="mobile-action-item"
                      onClick={handleLogout}
                    >
                      <span>Çıkış Yap</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mobile-auth-buttons">
                  <Button 
                    variant="primary" 
                    className="mobile-auth-btn"
                    as={Link} 
                    to="/login"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    Giriş Yap
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="mobile-auth-btn"
                    as={Link} 
                    to="/register"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    Kayıt Ol
                  </Button>
                </div>
              )}
            </div>
            
            {/* Ana navigasyon */}
            <Nav className="mobile-main-nav">
              <Nav.Link 
                as={Link} 
                to="/" 
                className="mobile-nav-item"
                onClick={() => setShowOffcanvas(false)}
              >
                Ana Sayfa
              </Nav.Link>
              
              <div className="mobile-nav-item has-submenu">
                <span>Kategoriler</span>
                <div className="submenu">
                  {categories.map((category) => (
                    <Nav.Link 
                      as={Link} 
                      to={`/products/${category.slug}`} 
                      key={category.id}
                      onClick={() => setShowOffcanvas(false)}
                      className="submenu-item"
                    >
                      {category.name}
                    </Nav.Link>
                  ))}
                  <Nav.Link 
                    as={Link} 
                    to="/products"
                    onClick={() => setShowOffcanvas(false)}
                    className="submenu-item"
                  >
                    Tüm Ürünler
                  </Nav.Link>
                </div>
              </div>
              
              <Nav.Link 
                as={Link} 
                to="/products/featured" 
                className="mobile-nav-item"
                onClick={() => setShowOffcanvas(false)}
              >
                Öne Çıkanlar
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/products/new" 
                className="mobile-nav-item"
                onClick={() => setShowOffcanvas(false)}
              >
                Yeni Gelenler
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/products/sale" 
                className="mobile-nav-item"
                onClick={() => setShowOffcanvas(false)}
              >
                İndirimli Ürünler
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/about" 
                className="mobile-nav-item"
                onClick={() => setShowOffcanvas(false)}
              >
                Hakkımızda
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/contact" 
                className="mobile-nav-item"
                onClick={() => setShowOffcanvas(false)}
              >
                İletişim
              </Nav.Link>
            </Nav>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header; 