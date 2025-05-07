import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Image, Button, Tabs, Tab, Form, Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaHeart, FaShoppingCart, FaShare, FaFacebook, FaTwitter, FaInstagram, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        // API'den ürün detayını getirme
        const response = await fetch(`/api/products/${productSlug}/`);
        const data = await response.json();
        setProduct(data);
        // Bu kısımda ilgili ürünlerin API'si olsaydı onları da alırdık.
        // Şimdilik benzer kategorideki ürünleri getiren bir istek simüle ediyoruz
        const relatedResponse = await fetch(`/api/products/?category=${data.categories[0].id}&limit=4`);
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.results || []);
      } catch (error) {
        console.error('Ürün detayı yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchProductDetail();
    }
  }, [productSlug]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock_count || 10)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock_count || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    // Sepete ekleme işlemi burada yapılacak
    console.log(`${quantity} adet ${product?.title} sepete eklendi.`);
    // API çağrısı burada olacak
    // fetch('/api/basket/add/', {
    //   method: 'POST',
    //   body: JSON.stringify({ product_id: product.id, quantity }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  };

  const addToWishlist = () => {
    // Favorilere ekleme işlemi burada yapılacak
    console.log(`${product?.title} favorilere eklendi.`);
  };

  // Mock ürün verileri (API'den gerçek veri gelene kadar)
  const mockProduct = {
    id: 1,
    title: 'Yüksek Kaliteli T-Shirt',
    slug: 'yuksek-kaliteli-t-shirt',
    price: 149.99,
    price_old: 199.99,
    rating: 4.5,
    rating_count: 128,
    stock_status: 'Stokta',
    stock_count: 15,
    description: 'Bu yüksek kaliteli t-shirt, %100 organik pamuktan üretilmiştir. Rahat kesimi ve yumuşak dokusuyla gün boyu rahatlık sağlar. Birçok renk ve beden seçeneğiyle her zevke uygun bir alternatif bulunmaktadır.',
    features: [
      '100% Organik Pamuk',
      'Nefes alabilen kumaş',
      'Uzun ömürlü baskı',
      'Kolay yıkama',
      'Çevre dostu üretim'
    ],
    images: [
      'https://via.placeholder.com/600x600',
      'https://via.placeholder.com/600x600',
      'https://via.placeholder.com/600x600',
      'https://via.placeholder.com/600x600'
    ],
    categories: [{ id: 1, name: 'Giyim', slug: 'giyim' }],
    tags: ['t-shirt', 'organik', 'pamuk'],
    brand: { id: 1, name: 'EcoFashion', slug: 'ecofashion' },
    variants: [
      { id: 1, name: 'Renk', options: ['Beyaz', 'Siyah', 'Mavi', 'Kırmızı'] },
      { id: 2, name: 'Beden', options: ['S', 'M', 'L', 'XL'] }
    ],
    specifications: [
      { name: 'Malzeme', value: '%100 Pamuk' },
      { name: 'Yıkama', value: '30° makinede yıkanabilir' },
      { name: 'Üretim Yeri', value: 'Türkiye' },
      { name: 'Desen', value: 'Düz' },
      { name: 'Kol Tipi', value: 'Kısa Kol' }
    ],
    reviews: [
      {
        id: 1,
        user: 'Ahmet Y.',
        rating: 5,
        date: '2023-05-15',
        comment: 'Gerçekten çok kaliteli bir ürün. Kumaşı yumuşak ve terletmiyor. Alışverişimden memnun kaldım.'
      },
      {
        id: 2,
        user: 'Ayşe K.',
        rating: 4,
        date: '2023-04-20',
        comment: 'Ürün güzel fakat biraz büyük geldi. Yine de kalitesi çok iyi.'
      },
      {
        id: 3,
        user: 'Mehmet S.',
        rating: 5,
        date: '2023-03-12',
        comment: 'Tam beklediğim gibi bir ürün. Rengi ve kumaşı çok güzel.'
      }
    ]
  };

  // API'den veri yoksa mock veriyi kullan
  const displayProduct = product || (loading ? null : mockProduct);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3">Ürün detayları yükleniyor...</p>
      </Container>
    );
  }

  if (!displayProduct) {
    return (
      <Container className="py-5 text-center">
        <h3>Ürün Bulunamadı</h3>
        <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Button as={Link} to="/products" variant="primary" className="mt-3">
          Ürünlere Dön
        </Button>
      </Container>
    );
  }

  return (
    <div className="product-detail-page py-5">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Ana Sayfa</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>Ürünler</Breadcrumb.Item>
          {displayProduct.categories[0] && (
            <Breadcrumb.Item 
              linkAs={Link} 
              linkProps={{ to: `/products/${displayProduct.categories[0].slug}` }}
            >
              {displayProduct.categories[0].name}
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item active>{displayProduct.title}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Product Detail */}
        <Row>
          {/* Product Images */}
          <Col lg={6} className="mb-4">
            <div className="product-images">
              <div className="main-image-container">
                <Image 
                  src={displayProduct.images[selectedImage]} 
                  alt={displayProduct.title} 
                  className="main-image img-fluid" 
                />
              </div>
              <div className="thumbnail-images mt-3">
                <Row>
                  {displayProduct.images.map((image, index) => (
                    <Col xs={3} key={index}>
                      <Image 
                        src={image} 
                        alt={`${displayProduct.title} - Görsel ${index + 1}`} 
                        className={`thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6}>
            <div className="product-info">
              <h1 className="product-title">{displayProduct.title}</h1>
              
              <div className="product-meta d-flex align-items-center mb-3">
                {displayProduct.brand && (
                  <div className="product-brand me-3">
                    <span className="text-muted">Marka: </span>
                    <Link to={`/products?brand=${displayProduct.brand.slug}`} className="fw-semibold">
                      {displayProduct.brand.name}
                    </Link>
                  </div>
                )}
                
                <div className="product-rating d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(displayProduct.rating) ? (
                        <FaStar className="star-filled" />
                      ) : i < Math.ceil(displayProduct.rating) && displayProduct.rating % 1 !== 0 ? (
                        <FaStar className="star-half" />
                      ) : (
                        <FaRegStar className="star-empty" />
                      )}
                    </span>
                  ))}
                  <span className="rating-text ms-2">
                    {displayProduct.rating} ({displayProduct.rating_count} değerlendirme)
                  </span>
                </div>
              </div>

              <div className="product-price mb-3">
                <span className="current-price">{displayProduct.price} TL</span>
                {displayProduct.price_old && (
                  <span className="old-price">{displayProduct.price_old} TL</span>
                )}
                {displayProduct.price_old && (
                  <span className="discount-badge">
                    {Math.round((1 - displayProduct.price / displayProduct.price_old) * 100)}% İndirim
                  </span>
                )}
              </div>

              <div className="product-short-desc mb-4">
                <p>{displayProduct.description.substring(0, 150)}...</p>
              </div>

              {/* Product Variants */}
              {displayProduct.variants && displayProduct.variants.map(variant => (
                <div className="product-variant mb-3" key={variant.id}>
                  <h6 className="variant-title">{variant.name}:</h6>
                  <div className="variant-options">
                    {variant.options.map((option, i) => (
                      <Button 
                        key={i}
                        variant="outline-secondary"
                        className={`variant-option me-2 ${i === 0 ? 'active' : ''}`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Stock Status */}
              <div className="stock-status mb-4">
                <span className={`badge ${displayProduct.stock_status === 'Stokta' ? 'bg-success' : 'bg-danger'}`}>
                  {displayProduct.stock_status}
                </span>
                <span className="stock-text ms-2">
                  {displayProduct.stock_count} adet stokta
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="product-actions">
                <div className="quantity-selector d-flex align-items-center mb-3">
                  <h6 className="me-3 mb-0">Adet:</h6>
                  <div className="quantity-input-group">
                    <Button 
                      variant="outline-secondary"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Form.Control 
                      type="number" 
                      min="1" 
                      max={displayProduct.stock_count}
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={increaseQuantity}
                      disabled={quantity >= displayProduct.stock_count}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="add-to-cart-area d-flex mb-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="add-to-cart-btn me-2"
                    onClick={addToCart}
                  >
                    <FaShoppingCart className="me-2" />
                    Sepete Ekle
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="wishlist-btn"
                    onClick={addToWishlist}
                  >
                    <FaHeart />
                  </Button>
                </div>
              </div>

              {/* Delivery and Returns */}
              <div className="product-info-items mb-4">
                <div className="info-item d-flex align-items-center mb-2">
                  <div className="info-icon me-2">
                    <FaTruck />
                  </div>
                  <div className="info-text">
                    <strong>Ücretsiz Kargo</strong> - 300 TL ve üzeri siparişlerde
                  </div>
                </div>
                <div className="info-item d-flex align-items-center mb-2">
                  <div className="info-icon me-2">
                    <FaUndo />
                  </div>
                  <div className="info-text">
                    <strong>30 Gün İade</strong> - Sorunsuz iade garantisi
                  </div>
                </div>
                <div className="info-item d-flex align-items-center">
                  <div className="info-icon me-2">
                    <FaShieldAlt />
                  </div>
                  <div className="info-text">
                    <strong>Güvenli Ödeme</strong> - SSL şifrelemesi ile güvenli alışveriş
                  </div>
                </div>
              </div>

              {/* Social Share */}
              <div className="social-share">
                <div className="share-title d-flex align-items-center mb-2">
                  <FaShare className="me-2" />
                  <span>Bu ürünü paylaş:</span>
                </div>
                <div className="share-buttons">
                  <a href="#" className="share-button me-2">
                    <FaFacebook />
                  </a>
                  <a href="#" className="share-button me-2">
                    <FaTwitter />
                  </a>
                  <a href="#" className="share-button">
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <div className="product-details-tabs mt-5">
          <Tabs
            id="product-details-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="description" title="Açıklama">
              <div className="tab-content-inner">
                <h3 className="mb-3">Ürün Açıklaması</h3>
                <p>{displayProduct.description}</p>
                
                <h4 className="mb-3 mt-4">Özellikler</h4>
                <ul className="feature-list">
                  {displayProduct.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </Tab>
            
            <Tab eventKey="specifications" title="Özellikler">
              <div className="tab-content-inner">
                <h3 className="mb-3">Teknik Özellikler</h3>
                <table className="table specifications-table">
                  <tbody>
                    {displayProduct.specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className="spec-name">{spec.name}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>
            
            <Tab eventKey="reviews" title={`Değerlendirmeler (${displayProduct.reviews.length})`}>
              <div className="tab-content-inner">
                <h3 className="mb-3">Müşteri Değerlendirmeleri</h3>
                
                <div className="review-summary mb-4">
                  <Row className="align-items-center">
                    <Col md={4} className="text-center mb-3 mb-md-0">
                      <div className="overall-rating">
                        <div className="rating-number">{displayProduct.rating}</div>
                        <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(displayProduct.rating) ? (
                                <FaStar className="star-filled" />
                              ) : i < Math.ceil(displayProduct.rating) && displayProduct.rating % 1 !== 0 ? (
                                <FaStar className="star-half" />
                              ) : (
                                <FaRegStar className="star-empty" />
                              )}
                            </span>
                          ))}
                        </div>
                        <div className="rating-count">
                          Toplam {displayProduct.rating_count} değerlendirme
                        </div>
                      </div>
                    </Col>
                    <Col md={8}>
                      <div className="rating-bars">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = displayProduct.reviews.filter(review => Math.round(review.rating) === star).length;
                          const percentage = (count / displayProduct.reviews.length) * 100;
                          
                          return (
                            <div className="rating-bar-item d-flex align-items-center mb-2" key={star}>
                              <div className="stars me-2">
                                {star} <FaStar className="star-filled" />
                              </div>
                              <div className="progress flex-grow-1">
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ width: `${percentage}%` }} 
                                  aria-valuenow={percentage} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <div className="count ms-2">
                                {count}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Col>
                  </Row>
                </div>
                
                <div className="reviews-list">
                  {displayProduct.reviews.map(review => (
                    <div className="review-item mb-4 p-3" key={review.id}>
                      <div className="review-header d-flex justify-content-between mb-2">
                        <div className="reviewer-info">
                          <h5 className="reviewer-name mb-0">{review.user}</h5>
                          <span className="review-date text-muted">{review.date}</span>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < review.rating ? "star-filled" : "star-empty"} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="review-content">
                        <p>{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="write-review mt-4">
                  <h4 className="mb-3">Değerlendirme Yazın</h4>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Puanınız</Form.Label>
                      <div className="rating-selector">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar 
                            key={star} 
                            className="rating-star" 
                          />
                        ))}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Yorumunuz</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="Bu ürün hakkında düşüncelerinizi paylaşın..." 
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Değerlendirme Gönder
                    </Button>
                  </Form>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="related-products mt-5">
          <h3 className="section-title mb-4">Benzer Ürünler</h3>
          <Row>
            {relatedProducts.length === 0 ? (
              <Col>
                <p className="text-muted">Henüz benzer ürün bulunmuyor.</p>
              </Col>
            ) : (
              relatedProducts.map(product => (
                <Col lg={3} md={6} className="mb-4" key={product.id}>
                  <Card className="product-card h-100">
                    <div className="product-image">
                      <Link to={`/product/${product.slug}`}>
                        <Card.Img 
                          variant="top" 
                          src={product.image || "https://via.placeholder.com/300"} 
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
                    <Card.Footer className="bg-transparent border-top-0">
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
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage; 