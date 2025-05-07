import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Breadcrumb, Pagination } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import { FaStar, FaFilter, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import './ProductListPage.css';

const ProductListPage = () => {
  const { categorySlug } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtre State
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let apiUrl = '/api/products/?page=' + currentPage;
        
        if (categorySlug) {
          apiUrl += `&category=${categorySlug}`;
        }
        
        if (searchQuery) {
          apiUrl += `&search=${searchQuery}`;
        }
        
        if (priceRange[0] > 0 || priceRange[1] < 5000) {
          apiUrl += `&price_min=${priceRange[0]}&price_max=${priceRange[1]}`;
        }
        
        if (selectedBrands.length > 0) {
          apiUrl += `&brands=${selectedBrands.join(',')}`;
        }
        
        if (sortBy) {
          let orderingParam = '';
          switch (sortBy) {
            case 'price_low':
              orderingParam = 'price';
              break;
            case 'price_high':
              orderingParam = '-price';
              break;
            case 'newest':
              orderingParam = '-date_created';
              break;
            case 'rating':
              orderingParam = '-rating';
              break;
            default:
              orderingParam = '-popularity';
          }
          apiUrl += `&ordering=${orderingParam}`;
        }
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        setProducts(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / 20));
      } catch (error) {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/catalogue/categories/');
        const data = await response.json();
        setCategories(data);
        
        if (categorySlug) {
          const category = data.find(cat => cat.slug === categorySlug);
          setCurrentCategory(category);
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [categorySlug, searchQuery, currentPage, priceRange, selectedBrands, sortBy]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    setPriceRange(newPriceRange);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const toggleFilterVisibility = () => {
    setFilterOpen(!filterOpen);
  };

  const brands = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Samsung' },
    { id: 3, name: 'Nike' },
    { id: 4, name: 'Adidas' },
    { id: 5, name: 'Sony' },
  ];

  // Sayfalama için pagination bileşenini oluştur
  const renderPagination = () => {
    let items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (currentPage > 1) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />
      );
    }
    
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>1</Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-1" disabled />);
      }
    }
    
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-2" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }
    
    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />
      );
    }
    
    return <Pagination className="justify-content-center mt-5">{items}</Pagination>;
  };

  return (
    <div className="product-list-page">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb className="mt-3 mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Ana Sayfa</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>Ürünler</Breadcrumb.Item>
          {currentCategory && (
            <Breadcrumb.Item active>{currentCategory.name}</Breadcrumb.Item>
          )}
          {searchQuery && (
            <Breadcrumb.Item active>Arama: {searchQuery}</Breadcrumb.Item>
          )}
        </Breadcrumb>

        {/* Page Title */}
        <div className="page-title mb-4">
          <h1>
            {currentCategory ? currentCategory.name : searchQuery ? `"${searchQuery}" için sonuçlar` : 'Tüm Ürünler'}
          </h1>
          <p>
            {products.length} ürün bulundu
          </p>
        </div>

        <Row>
          {/* Filter Sidebar */}
          <Col lg={3} className={`filter-sidebar ${filterOpen ? 'open' : ''}`}>
            <div className="filter-header d-lg-none">
              <h5>Filtreler</h5>
              <button className="close-btn" onClick={toggleFilterVisibility}>×</button>
            </div>
            
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Kategoriler</h5>
              </Card.Header>
              <Card.Body>
                <ul className="category-list">
                  <li className={!categorySlug ? 'active' : ''}>
                    <Link to="/products">Tüm Ürünler</Link>
                  </li>
                  {categories.map((category) => (
                    <li 
                      key={category.id} 
                      className={categorySlug === category.slug ? 'active' : ''}
                    >
                      <Link to={`/products/${category.slug}`}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Fiyat Aralığı</h5>
              </Card.Header>
              <Card.Body>
                <div className="price-inputs d-flex align-items-center mb-3">
                  <Form.Control 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange[0]} 
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="me-2"
                  />
                  <span className="mx-2">-</span>
                  <Form.Control 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange[1]} 
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="ms-2"
                  />
                </div>
                <div className="range-slider">
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    value={priceRange[0]} 
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="slider slider-min"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    value={priceRange[1]} 
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="slider slider-max"
                  />
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Markalar</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  {brands.map((brand) => (
                    <Form.Check 
                      type="checkbox"
                      key={brand.id}
                      id={`brand-${brand.id}`}
                      label={brand.name}
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandChange(brand.name)}
                      className="mb-2"
                    />
                  ))}
                </Form>
              </Card.Body>
            </Card>

            <Button 
              variant="secondary" 
              className="w-100 mb-4 d-lg-none"
              onClick={toggleFilterVisibility}
            >
              Filtreleri Uygula
            </Button>
          </Col>

          {/* Product List */}
          <Col lg={9}>
            <div className="product-list-header mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <Button 
                  variant="outline-secondary" 
                  className="filter-toggle d-lg-none"
                  onClick={toggleFilterVisibility}
                >
                  <FaFilter /> Filtreler
                </Button>
                
                <div className="sort-options d-flex align-items-center">
                  <Form.Select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="me-3"
                  >
                    <option value="popularity">Popülerlik</option>
                    <option value="price_low">Fiyat: Düşükten Yükseğe</option>
                    <option value="price_high">Fiyat: Yüksekten Düşüğe</option>
                    <option value="newest">En Yeniler</option>
                    <option value="rating">En Çok Değerlendirilenler</option>
                  </Form.Select>
                  
                  <div className="view-options">
                    <Button 
                      variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
                      className="me-2"
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="bi bi-grid"></i>
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
                      onClick={() => setViewMode('list')}
                    >
                      <i className="bi bi-list"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Yükleniyor...</span>
                </div>
                <p className="mt-3">Ürünler yükleniyor...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h3>Ürün Bulunamadı</h3>
                <p>Arama kriterlerinize uygun ürün bulunamadı. Lütfen farklı filtreler deneyin.</p>
              </div>
            ) : (
              <Row>
                {products.map((product) => (
                  <Col 
                    key={product.id}
                    xs={12}
                    md={viewMode === 'grid' ? 6 : 12}
                    lg={viewMode === 'grid' ? 4 : 12}
                    className="mb-4"
                  >
                    <Card className={`product-card h-100 ${viewMode === 'list' ? 'product-card-list' : ''}`}>
                      <div className="row g-0">
                        <div className={viewMode === 'list' ? 'col-md-4' : ''}>
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
                        </div>
                        <div className={viewMode === 'list' ? 'col-md-8' : ''}>
                          <Card.Body>
                            <Card.Title>
                              <Link to={`/product/${product.slug}`}>
                                {product.title}
                              </Link>
                            </Card.Title>
                            
                            {viewMode === 'list' && product.description && (
                              <Card.Text className="product-description">
                                {product.description.substring(0, 150)}...
                              </Card.Text>
                            )}
                            
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
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && renderPagination()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductListPage; 