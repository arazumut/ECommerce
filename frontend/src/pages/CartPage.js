import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        // API'den sepet bilgilerini getirme
        const response = await fetch('/api/basket/');
        
        if (!response.ok) {
          throw new Error('Sepet bilgileri alınamadı');
        }
        
        const data = await response.json();
        setCartItems(data.lines || []);
        if (data.voucher_discounts && data.voucher_discounts.length > 0) {
          setCouponApplied(true);
          setCouponDiscount(data.voucher_discounts[0].amount);
        }
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error);
        setError('Sepet bilgileri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Mock sepet verileri
  const mockCartItems = [
    {
      id: 1,
      product: {
        id: 101,
        title: 'Yüksek Kaliteli T-Shirt',
        slug: 'yuksek-kaliteli-t-shirt',
        image: 'https://via.placeholder.com/100',
        price: 149.99
      },
      attributes: [
        { name: 'Renk', value: 'Beyaz' },
        { name: 'Beden', value: 'M' }
      ],
      quantity: 2,
      price_incl_tax: 149.99,
      price_excl_tax: 127.11,
      price_subtotal: 299.98,
      price_subtotal_excl_tax: 254.22
    },
    {
      id: 2,
      product: {
        id: 102,
        title: 'Premium Kot Pantolon',
        slug: 'premium-kot-pantolon',
        image: 'https://via.placeholder.com/100',
        price: 249.99
      },
      attributes: [
        { name: 'Renk', value: 'Mavi' },
        { name: 'Beden', value: '32' }
      ],
      quantity: 1,
      price_incl_tax: 249.99,
      price_excl_tax: 211.86,
      price_subtotal: 249.99,
      price_subtotal_excl_tax: 211.86
    }
  ];

  // Mock sepet özeti
  const mockCartSummary = {
    basket_total_incl_tax: 549.97,
    basket_total_excl_tax: 466.08,
    shipping_incl_tax: 25.00,
    shipping_excl_tax: 21.19,
    total_incl_tax: 574.97,
    total_excl_tax: 487.27,
    tax: 87.70
  };

  const displayCartItems = cartItems.length > 0 ? cartItems : mockCartItems;
  const cartSummary = cartItems.length > 0 ? {
    basket_total_incl_tax: cartItems.reduce((sum, item) => sum + item.price_subtotal, 0),
    tax: cartItems.reduce((sum, item) => sum + (item.price_subtotal - item.price_subtotal_excl_tax), 0),
    shipping_incl_tax: 25.00
  } : mockCartSummary;

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // API ile sepet güncelleme
      // await fetch(`/api/basket/lines/${itemId}/`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ quantity: newQuantity })
      // });

      // Mock güncelleme
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? {
            ...item,
            quantity: newQuantity,
            price_subtotal: item.price_incl_tax * newQuantity,
            price_subtotal_excl_tax: item.price_excl_tax * newQuantity
          } : item
        )
      );
    } catch (error) {
      console.error('Sepet güncellenirken hata oluştu:', error);
      setError('Sepet güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      // API ile sepetten ürün silme
      // await fetch(`/api/basket/lines/${itemId}/`, {
      //   method: 'DELETE'
      // });

      // Mock silme işlemi
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Ürün sepetten silinirken hata oluştu:', error);
      setError('Ürün sepetten silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError('Lütfen bir kupon kodu girin.');
      return;
    }

    // Örnek bir kupon kontrolü
    if (couponCode === 'INDIRIM20') {
      const discount = cartSummary.basket_total_incl_tax * 0.2;
      setCouponDiscount(discount);
      setCouponApplied(true);
      setError(null);
    } else {
      setError('Geçersiz kupon kodu.');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const totalAfterDiscount = (cartSummary.basket_total_incl_tax - couponDiscount);
  const grandTotal = totalAfterDiscount + cartSummary.shipping_incl_tax;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3">Sepet bilgileri yükleniyor...</p>
      </Container>
    );
  }

  if (displayCartItems.length === 0) {
    return (
      <Container className="py-5">
        <div className="empty-cart text-center py-5">
          <FaShoppingCart size={60} className="mb-4 text-muted" />
          <h2>Sepetiniz Boş</h2>
          <p className="mb-4">Sepetinizde ürün bulunmamaktadır.</p>
          <Button 
            as={Link} 
            to="/products" 
            variant="primary" 
            className="px-4 py-2"
          >
            Alışverişe Başla
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="cart-page py-5">
      <Container>
        <h1 className="page-title mb-4">Alışveriş Sepeti</h1>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {couponApplied && (
          <Alert variant="success" className="mb-4">
            Kupon kodu başarıyla uygulandı. %20 indirim kazandınız!
          </Alert>
          
        )}

        <Row>
          <Col lg={8} className="mb-4">
            <Card className="cart-items-card">
              <Card.Body>
                <div className="table-responsive">
                  <Table className="cart-table">
                    <thead>
                      <tr>
                        <th width="100">Ürün</th>
                        <th>Açıklama</th>
                        <th width="120">Fiyat</th>
                        <th width="150">Adet</th>
                        <th width="120">Toplam</th>
                        <th width="50"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayCartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <Link to={`/product/${item.product.slug}`}>
                              <img 
                                src={item.product.image} 
                                alt={item.product.title} 
                                className="cart-product-img"
                              />
                            </Link>
                          </td>
                          <td>
                            <Link to={`/product/${item.product.slug}`} className="product-title">
                              {item.product.title}
                            </Link>
                            {item.attributes && item.attributes.length > 0 && (
                              <div className="product-attrs">
                                {item.attributes.map((attr, idx) => (
                                  <span key={idx} className="product-attr">
                                    {attr.name}: {attr.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="price">
                            {item.price_incl_tax.toFixed(2)} TL
                          </td>
                          <td>
                            <div className="quantity-control">
                              <Button 
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="quantity">{item.quantity}</span>
                              <Button 
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="subtotal">
                            {item.price_subtotal.toFixed(2)} TL
                          </td>
                          <td>
                            <Button 
                              variant="link" 
                              className="remove-btn"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="cart-actions mt-4 d-flex justify-content-between align-items-center">
                  <Button
                    as={Link}
                    to="/products"
                    variant="outline-secondary"
                    className="continue-shopping"
                  >
                    <FaArrowLeft className="me-2" /> Alışverişe Devam Et
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="cart-summary-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Sepet Özeti</h5>
              </Card.Header>
              <Card.Body>
                <div className="summary-item d-flex justify-content-between mb-2">
                  <span>Ara Toplam:</span>
                  <span>{cartSummary.basket_total_incl_tax.toFixed(2)} TL</span>
                </div>
                
                {couponApplied && (
                  <div className="summary-item d-flex justify-content-between mb-2 discount">
                    <span>İndirim:</span>
                    <span>-{couponDiscount.toFixed(2)} TL</span>
                  </div>
                )}
                
                <div className="summary-item d-flex justify-content-between mb-2">
                  <span>Kargo:</span>
                  <span>{cartSummary.shipping_incl_tax.toFixed(2)} TL</span>
                </div>
                
                <div className="summary-item d-flex justify-content-between mb-2">
                  <span>KDV:</span>
                  <span>{cartSummary.tax.toFixed(2)} TL</span>
                </div>
                
                <hr />
                
                <div className="summary-total d-flex justify-content-between mb-3">
                  <span>Genel Toplam:</span>
                  <span className="total-price">{grandTotal.toFixed(2)} TL</span>
                </div>
                
                <Button 
                  as={Link}
                  to="/checkout"
                  variant="primary" 
                  size="lg" 
                  className="w-100 mb-3"
                >
                  Ödeme Adımına Geç
                </Button>
                
                <div className="coupon-section">
                  <Form.Group className="mb-3">
                    <Form.Label>İndirim Kuponu</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Kupon kodu"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleApplyCoupon}
                        className="ms-2"
                      >
                        Uygula
                      </Button>
                    </div>
                    <Form.Text className="text-muted">
                      Test için "INDIRIM20" kuponunu kullanabilirsiniz.
                    </Form.Text>
                  </Form.Group>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="payment-info-card">
              <Card.Body>
                <h6 className="mb-3">Ödeme Seçenekleri</h6>
                <p className="mb-2 text-muted">
                  Tüm kredi kartlarına 12 aya varan taksit imkanı.
                </p>
                <div className="payment-icons">
                  <img src="https://via.placeholder.com/40x25" alt="Visa" className="me-2" />
                  <img src="https://via.placeholder.com/40x25" alt="MasterCard" className="me-2" />
                  <img src="https://via.placeholder.com/40x25" alt="PayPal" className="me-2" />
                  <img src="https://via.placeholder.com/40x25" alt="American Express" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage; 