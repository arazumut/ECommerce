import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight, FaShippingFast, FaLock, FaUndo, FaHeadset } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/?featured=true');
        const data = await response.json();
        setFeaturedProducts(data.results || []);
      } catch (error) {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      }
    };

    const fetchNewArrivals = async () => {
      try {
        const response = await fetch('/api/products/?ordering=-date_created&limit=8');
        const data = await response.json();
        setNewArrivals(data.results || []);
      } catch (error) {
        console.error('Yeni ürünler yüklenirken hata oluştu:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/catalogue/categories/');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
    fetchNewArrivals();
    fetchCategories();
  }, []);

  // Slider görselleri
  const heroSlides = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500&q=80',
      title: 'Yeni Sezon Ürünleri',
      subtitle: 'Özel indirimlerle şimdi satışta',
      buttonText: 'Alışverişe Başla',
      buttonLink: '/products',
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500&q=80',
      title: 'Teknoloji Ürünlerinde Büyük İndirim',
      subtitle: '%30\'a varan indirimlerle sınırlı süre için',
      buttonText: 'İncele',
      buttonLink: '/products/technology',
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=500&q=80',
      title: 'Yaz Koleksiyonu',
      subtitle: 'Yeni sezon ürünleri keşfedin',
      buttonText: 'Koleksiyonu Gör',
      buttonLink: '/products/summer-collection',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <section className="hero-section">
        <Carousel fade interval={5000} className="hero-carousel">
          {heroSlides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <img
                className="d-block w-100"
                src={slide.imageUrl}
                alt={slide.title}
              />
              <Carousel.Caption className="hero-caption">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <Button 
                  as={Link} 
                  to={slide.buttonLink}
                  variant="primary" 
                  size="lg"
                  className="hero-button"
                >
                  {slide.buttonText}
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaShippingFast />
                </div>
                <h5>Ücretsiz Kargo</h5>
                <p>300 TL üzeri tüm siparişlerde</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaUndo />
                </div>
                <h5>30 Gün İade</h5>
                <p>Sorunsuz iade garantisi</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaLock />
                </div>
                <h5>Güvenli Ödeme</h5>
                <p>100% Güvenli ödeme</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaHeadset />
                </div>
                <h5>7/24 Destek</h5>
                <p>Her zaman yanınızdayız</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <Container>
          <div className="section-title mb-5">
            <h2>Kategoriler</h2>
            <p>İhtiyacınız olan her şey tek bir yerde</p>
          </div>
          
          <Row className="g-4">
            {loading ? (
              <div className="text-center py-5">Yükleniyor...</div>
            ) : (
              categories.slice(0, 4).map((category) => (
                <Col md={3} sm={6} key={category.id}>
                  <Link to={`/products/${category.slug}`} className="category-card">
                    <Card className="text-center h-100">
                      <div className="category-image">
                        <Card.Img 
                          variant="top" 
                          src={category.image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80"} 
                          alt={category.name} 
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>{category.name}</Card.Title>
                        <span className="category-link">
                          Ürünleri Gör <FaArrowRight size={14} />
                        </span>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))
            )}
          </Row>
          
          <div className="text-center mt-4">
            <Button 
              as={Link} 
              to="/products" 
              variant="outline-primary"
              className="view-all-btn"
            >
              Tüm Kategorileri Gör
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section py-5">
        <Container>
          <div className="section-title mb-5">
            <h2>Öne Çıkan Ürünler</h2>
            <p>En çok satan ürünlerimizi keşfedin</p>
          </div>
          
          <Row className="g-4">
            {loading ? (
              <div className="text-center py-5">Yükleniyor...</div>
            ) : (
              featuredProducts.slice(0, 4).map((product) => (
                <Col lg={3} md={6} key={product.id}>
                  <Card className="product-card h-100">
                    <div className="product-image">
                      <Link to={`/product/${product.slug}`}>
                        <Card.Img 
                          variant="top" 
                          src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"} 
                          alt={product.title} 
                        />
                      </Link>
                      {product.is_on_sale && (
                        <span className="product-badge">İndirim</span>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/product/${product.slug}`}>
                          {product.title}
                        </Link>
                      </Card.Title>
                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.round(product.rating || 0) ? "star-filled" : "star-empty"} 
                          />
                        ))}
                        <span className="rating-count">({product.rating_count || 0})</span>
                      </div>
                      <div className="product-price">
                        {product.price_old && (
                          <span className="price-old">{product.price_old} TL</span>
                        )}
                        <span className="price-current">{product.price} TL</span>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-transparent">
                      <Button 
                        variant="primary" 
                        className="w-100"
                      >
                        Sepete Ekle
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            )}
          </Row>
          
          <div className="text-center mt-5">
            <Button 
              as={Link} 
              to="/products" 
              variant="outline-primary"
              className="view-all-btn"
            >
              Tüm Ürünleri Gör
            </Button>
          </div>
        </Container>
      </section>

      {/* Banner Section */}
      <section className="banner-section py-5">
        <Container>
          <div className="banner">
            <div className="banner-content">
              <h2>Yaz İndirimleri Başladı</h2>
              <p>Tüm yaz ürünlerinde %50'ye varan indirimler</p>
              <Button 
                as={Link} 
                to="/products/summer-sale" 
                variant="secondary"
                size="lg"
                className="mt-3"
              >
                Şimdi Alışveriş Yap
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* New Arrivals Section */}
      <section className="new-arrivals-section py-5">
        <Container>
          <div className="section-title mb-5">
            <h2>Yeni Ürünler</h2>
            <p>En yeni ürünlerimizi keşfedin</p>
          </div>
          
          <Row className="g-4">
            {loading ? (
              <div className="text-center py-5">Yükleniyor...</div>
            ) : (
              newArrivals.slice(0, 4).map((product) => (
                <Col lg={3} md={6} key={product.id}>
                  <Card className="product-card h-100">
                    <div className="product-image">
                      <Link to={`/product/${product.slug}`}>
                        <Card.Img 
                          variant="top" 
                          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"} 
                          alt={product.title} 
                        />
                      </Link>
                      <span className="product-badge bg-success">Yeni</span>
                    </div>
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/product/${product.slug}`}>
                          {product.title}
                        </Link>
                      </Card.Title>
                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.round(product.rating || 0) ? "star-filled" : "star-empty"} 
                          />
                        ))}
                        <span className="rating-count">({product.rating_count || 0})</span>
                      </div>
                      <div className="product-price">
                        {product.price_old && (
                          <span className="price-old">{product.price_old} TL</span>
                        )}
                        <span className="price-current">{product.price} TL</span>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-transparent">
                      <Button 
                        variant="primary" 
                        className="w-100"
                      >
                        Sepete Ekle
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            )}
          </Row>
          
          <div className="text-center mt-5">
            <Button 
              as={Link} 
              to="/products?sort=newest" 
              variant="outline-primary"
              className="view-all-btn"
            >
              Tüm Yeni Ürünleri Gör
            </Button>
          </div>
        </Container>
      </section>

      {/* Subscribe Section */}
      <section className="subscribe-section py-5">
        <Container>
          <div className="subscribe-content text-center">
            <h2>Bültenimize Abone Olun</h2>
            <p>En son ürün ve kampanyalardan haberdar olun</p>
            <Row className="justify-content-center mt-4">
              <Col md={6}>
                <form className="subscribe-form">
                  <div className="input-group">
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="E-posta adresiniz" 
                      required 
                    />
                    <Button 
                      variant="primary" 
                      type="submit"
                    >
                      Abone Ol
                    </Button>
                  </div>
                </form>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      <section className="about-summary-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="about-summary-content">
                <h2>Biz Kimiz?</h2>
                <p>
                  2015 yılından beri müşterilerimize yüksek kaliteli ürünleri uygun fiyatlarla sunarak, güvenilir ve keyifli bir alışveriş deneyimi yaşatıyoruz.
                </p>
                <p>
                  Türkiye'nin en sevilen ve en çok tercih edilen e-ticaret markası olma vizyonumuzla, her gün daha iyisini sunmak için çalışıyoruz.
                </p>
                <Button 
                  as={Link} 
                  to="/about" 
                  variant="outline-primary"
                  className="mt-3"
                >
                  Daha Fazla Bilgi
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-summary-image">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Şirket Ofisi" 
                  className="img-fluid rounded shadow" 
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage; 