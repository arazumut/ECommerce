import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  
  useEffect(() => {
    // Favori ürünleri yükle ve uygulama durumunu sakla
    fetchWishlistItems();
    
    // Sepet güncellendiğinde favorileri yeniden yükle
    window.addEventListener('basketUpdated', fetchWishlistItems);
    
    return () => {
      window.removeEventListener('basketUpdated', fetchWishlistItems);
    };
  }, []);
  
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Yerel depolamadan favori ürünleri al
      const storedWishlist = localStorage.getItem('wishlist');
      const wishlistIds = storedWishlist ? JSON.parse(storedWishlist) : [];
      
      if (wishlistIds.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }
      
      // Her ürün ID'si için detayları getir
      const productPromises = wishlistIds.map(async (id) => {
        try {
          const response = await fetch(`/api/products/${id}/`);
          
          if (!response.ok) {
            console.error(`Ürün bilgisi alınamadı (ID: ${id}): ${response.status}`);
            return null;
          }
          
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Ürün verileri alınamadı (ID: ${id}):`, error);
          return null;
        }
      });
      
      // Tüm ürün verilerini al
      const productsData = await Promise.all(productPromises);
      
      // null değerleri filtrele (bulunamayan ürünler)
      const validProducts = productsData.filter(product => product !== null);
      
      // Bulunamayan ürünleri localStorage'dan da temizle
      if (validProducts.length !== wishlistIds.length) {
        const validIds = validProducts.map(product => product.id);
        const newWishlistIds = wishlistIds.filter(id => validIds.includes(id));
        localStorage.setItem('wishlist', JSON.stringify(newWishlistIds));
      }
      
      setWishlistItems(validProducts);
    } catch (error) {
      console.error('Favoriler yüklenirken hata oluştu:', error);
      setError('Favoriler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };
  
  const removeFromWishlist = (productId) => {
    // Listedeki ürünü kaldır
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedItems);
    
    // localStorage'daki favori listesini güncelle
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      const wishlistData = JSON.parse(storedWishlist);
      const updatedIds = wishlistData.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedIds));
      
      // Wishlist güncellemesi olayını tetikle
      const event = new CustomEvent('wishlistUpdated');
      window.dispatchEvent(event);
    }
    
    // Başarı mesajı göster
    showToast(`Ürün favorilerden kaldırıldı.`);
  };
  
  const addToCart = async (product) => {
    // Ürün ID kontrolü
    const productId = product.id;
    if (!productId) {
      showToast('Ürün eklenemiyor: Ürün bilgisi eksik.', 'error');
      return;
    }
    
    // Sepete eklendiğini belirt (yükleniyor durumu)
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      // API'ye sepete ekleme isteği gönder
      const response = await fetch('/api/basket/add-product/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `/api/products/${productId}/`,
          quantity: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`Sepete ekleme başarısız oldu: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Ürün sepete eklendi:', data);
      
      // Başarı mesajı göster
      showToast(`${product.title} sepete eklendi!`, 'success');
      
      // Sepet güncellendi bilgisini diğer bileşenlere ilet
      const event = new CustomEvent('basketUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Sepete eklerken hata oluştu:', error);
      showToast('Sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    } finally {
      // Yükleniyor durumunu kaldır
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };
  
  const clearWishlist = () => {
    // Kullanıcıya onay sor
    if (window.confirm('Tüm favorileri silmek istediğinize emin misiniz?')) {
      // Tüm favorileri temizle
      setWishlistItems([]);
      localStorage.removeItem('wishlist');
      
      // Wishlist güncellemesi olayını tetikle
      const event = new CustomEvent('wishlistUpdated');
      window.dispatchEvent(event);
      
      showToast('Tüm favoriler temizlendi.');
    }
  };
  
  const showToast = (message, type = 'info') => {
    // Toast mesajını gösterecek fonksiyon
    const toastDiv = document.createElement('div');
    toastDiv.className = `cart-success-toast toast-${type}`;
    toastDiv.innerHTML = `
      <div class="cart-success-content">
        <div class="cart-success-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
        <div class="cart-success-message">
          <strong>${message}</strong>
        </div>
      </div>
      <div class="cart-success-actions">
        <button class="btn btn-link btn-sm close-toast">Kapat</button>
      </div>
    `;
    document.body.appendChild(toastDiv);
    
    // Toast'u otomatik kapat
    setTimeout(() => {
      toastDiv.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(toastDiv);
      }, 300);
    }, 5000);
    
    // Manuel kapatma butonu
    const closeBtn = toastDiv.querySelector('.close-toast');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toastDiv.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(toastDiv);
        }, 300);
      });
    }
  };
  
  return (
    <div className="wishlist-page py-5">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Ana Sayfa</Breadcrumb.Item>
          <Breadcrumb.Item active>Favorilerim</Breadcrumb.Item>
        </Breadcrumb>
        
        <h1 className="page-title mb-4">Favorilerim</h1>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mt-3">Favoriler yükleniyor...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <Alert variant="info">
            <div className="text-center py-4">
              <FaHeart size={40} className="mb-3 text-muted" />
              <h3>Favorileriniz Boş</h3>
              <p>Henüz favori ürününüz bulunmuyor.</p>
              <Button as={Link} to="/products" variant="primary" className="mt-2">
                Alışverişe Başla
              </Button>
            </div>
          </Alert>
        ) : (
          <>
            <div className="wishlist-actions mb-4 text-end">
              <Button variant="outline-danger" onClick={clearWishlist}>
                <FaTrash className="me-2" />
                Tüm Favorileri Temizle
              </Button>
            </div>
            
            <Row>
              {wishlistItems.map(product => (
                <Col key={product.id} lg={4} md={6} className="mb-4">
                  <Card className="wishlist-item h-100">
                    <div className="position-relative">
                      <Link to={`/product/${product.slug}`}>
                        <Card.Img variant="top" src={product.image || 'https://via.placeholder.com/300'} alt={product.title} />
                      </Link>
                      <Button 
                        variant="light" 
                        className="remove-btn"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/product/${product.slug}`} className="product-title">
                          {product.title}
                        </Link>
                      </Card.Title>
                      <div className="product-price mb-3">
                        <span className="current-price">{product.price} TL</span>
                        {product.price_old && (
                          <span className="old-price">{product.price_old} TL</span>
                        )}
                      </div>
                      <div className="stock-status mb-3">
                        <span className={`badge ${product.stock_status === 'Stokta' ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock_status || 'Stokta'}
                        </span>
                      </div>
                      <Button 
                        variant="primary" 
                        className="w-100"
                        onClick={() => addToCart(product)}
                        disabled={addingToCart[product.id]}
                      >
                        {addingToCart[product.id] ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Ekleniyor...
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="me-2" />
                            Sepete Ekle
                          </>
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default WishlistPage; 