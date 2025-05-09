import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaHeart, FaShoppingCart, FaEye, FaRegHeart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    // API call to add product to cart
    console.log(`Ürün sepete eklendi: ${product.name}`);
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
          >
            <FaShoppingCart /> <span>Sepete Ekle</span>
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