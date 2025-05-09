import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaHeart, FaShoppingCart, FaEye, FaRegHeart, FaSpinner } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Discount calculation
  const hasDiscount = product.sale_price && product.price > product.sale_price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  // Hover handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Add to cart handler
  const handleAddToCart = (e) => {
    e.preventDefault();
    
    // Butonun durmunu yükleniyor olarak güncelle
    setIsAddingToCart(true);
    
    // Ürün ID'si ve URL formatını kontrol et
    let productId = product.id;
    if (!productId && product.url) {
      // Bazen URL'den ID çıkarılabilir
      const urlParts = product.url.split('/');
      productId = urlParts[urlParts.length - 2]; // URL sonundaki slash'tan önceki değer
    }
    
    if (!productId) {
      console.error('Ürün ID bilgisi bulunamadı:', product);
      alert('Ürün eklenemiyor: Ürün bilgisi eksik.');
      setIsAddingToCart(false);
      return;
    }
    
    // API çağrısı ile sepete ürün ekleme
    fetch('/api/basket/add-product/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `/api/products/${productId}/`,
        quantity: 1
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Sepete ekleme işlemi başarısız oldu: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Ürün sepete eklendi:', data);
        
        // Başarılı bildirim göster
        const productName = product.name || product.title || 'Ürün';
        alert(`${productName} sepete eklendi!`);
        
        // Sepet bilgisini güncelle
        const event = new CustomEvent('basketUpdated');
        window.dispatchEvent(event);
      })
      .catch(error => {
        console.error('Sepete eklerken hata oluştu:', error);
        alert('Sepete eklerken bir hata oluştu. Lütfen tekrar deneyin.');
      })
      .finally(() => {
        // İşlem tamamlandığında butonu normal duruma getir
        setIsAddingToCart(false);
      });
  };

  // Toggle favorite handler
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    console.log(`Favorilere ${isFavorite ? 'çıkarıldı' : 'eklendi'}: ${product.name}`);
  };

  // Quick view handler
  const handleQuickView = (e) => {
    e.preventDefault();
    console.log(`Hızlı görüntüleme: ${product.name}`);
    // Implementation for quick view modal
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="star-half" />);
      } else {
        stars.push(<FaStar key={i} className="star-empty" />);
      }
    }
    
    return stars;
  };

  return (
    <Card 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-image-container">
        {/* İndirim etiketi */}
        {hasDiscount && (
          <Badge bg="danger" className="product-badge discount">
            %{discountPercentage} İndirim
          </Badge>
        )}

        {/* Yeni ürün etiketi */}
        {product.is_new && (
          <Badge bg="primary" className="product-badge new">
            Yeni
          </Badge>
        )}

        {/* Favori butonu */}
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label="Favorilere ekle"
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        {/* Görsel */}
        <Link to={`/product/${product.slug}`}>
          <div className="product-img-wrapper">
            <img
              src={product.image || 'https://via.placeholder.com/300x300'}
              alt={product.name}
              className="product-img"
            />
            {product.images && product.images.length > 1 && (
              <img
                src={product.images[1] || product.image || 'https://via.placeholder.com/300x300'}
                alt={product.name}
                className="product-img-hover"
              />
            )}
          </div>
        </Link>

        {/* Hızlı erişim butonları */}
        <div className="product-actions">
          <Button 
            variant="primary" 
            className="action-btn add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <FaSpinner className="fa-spin" /> <span>Ekleniyor...</span>
              </>
            ) : (
              <>
                <FaShoppingCart /> <span>Sepete Ekle</span>
              </>
            )}
          </Button>
          <Button 
            variant="light" 
            className="action-btn quick-view-btn"
            onClick={handleQuickView}
          >
            <FaEye /> <span>Hızlı İncele</span>
          </Button>
        </div>
      </div>

      <Card.Body>
        <div className="product-category">
          {product.category_name}
        </div>
        
        <Card.Title className="product-title">
          <Link to={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </Card.Title>
        
        <div className="product-rating">
          <div className="stars">
            {renderStars(product.rating || 0)}
          </div>
          {product.review_count > 0 && (
            <span className="review-count">({product.review_count})</span>
          )}
        </div>
        
        <div className="product-price">
          {hasDiscount && (
            <span className="price-old">{product.price?.toLocaleString('tr-TR')} TL</span>
          )}
          <span className="price-current">
            {(product.sale_price || product.price)?.toLocaleString('tr-TR')} TL
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard; 