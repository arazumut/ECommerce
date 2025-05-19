import React, { useState } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './CategoryFilter.css';

const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  brands, 
  selectedBrands, 
  onBrandChange,
  priceRange,
  onPriceChange,
  onFilterApply,
  onFilterReset
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Kategorilerin hiyerarşik ağaç yapısı
  const renderCategoryTree = (categoryList, level = 0) => {
    if (!categoryList || categoryList.length === 0) return null;

    return (
      <ul className={`category-list ${level > 0 ? 'subcategory-list' : ''}`}>
        {categoryList.map((category) => (
          <li key={category.id} className="category-item">
            <Form.Check
              type="checkbox"
              id={`category-${category.id}`}
              label={category.name}
              checked={selectedCategories.includes(category.id)}
              onChange={() => onCategoryChange(category.id)}
              className="category-checkbox"
            />
            {category.children && category.children.length > 0 && (
              renderCategoryTree(category.children, level + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {/* Mobil filtre düğmesi */}
      <div className="mobile-filter-toggle d-md-none">
        <Button 
          variant="outline-primary" 
          className="filter-toggle-btn w-100"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <FaFilter className="me-2" />
          Filtreler {showMobileFilters ? <FaChevronUp /> : <FaChevronDown />}
        </Button>
      </div>
      
      {/* Ana filtreleme bileşeni */}
      <div className={`filter-sidebar ${showMobileFilters ? 'show-mobile' : ''}`}>
        <div className="filter-header d-flex justify-content-between d-md-none">
          <h5 className="mb-0">Filtreler</h5>
          <Button 
            variant="link" 
            className="p-0 close-filter"
            onClick={() => setShowMobileFilters(false)}
          >
            &times;
          </Button>

          <Button variant="outline-secondary" onClick={onFilterReset}>
            Filtreleri Temizle
          </Button>
        </div>
        
        <div className="filter-content">
          {/* Fiyat Aralığı */}
          <div className="filter-section">
            <h5 className="filter-title">Fiyat Aralığı</h5>
            <div className="price-slider">
              <div className="price-range-text mb-2">
                <span className="min-price">{priceRange.min} TL</span>
                <span className="max-price">{priceRange.max} TL</span>
              </div>
              <Form.Range 
                min={0}
                max={10000}
                step={100}
                value={priceRange.max}
                onChange={(e) => onPriceChange({ ...priceRange, max: Number(e.target.value) })}
                className="price-range-slider"
              />
            </div>
          </div>
          {/* Kategoriler */}
          <Accordion defaultActiveKey="0" className="filter-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Kategoriler</Accordion.Header>
              <Accordion.Body>
                {renderCategoryTree(categories)}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          {/* Markalar */}
          <Accordion defaultActiveKey="0" className="filter-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Markalar</Accordion.Header>
              <Accordion.Body>
                <div className="brand-filter">
                  {brands && brands.length > 0 ? (
                    <Form>
                      {brands.map((brand) => (
                        <Form.Check
                          key={brand.id}
                          type="checkbox"
                          id={`brand-${brand.id}`}
                          label={brand.name}
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => onBrandChange(brand.id)}
                          className="brand-checkbox"
                        />
                      ))}
                    </Form>
                  ) : (
                    <p className="text-muted">Marka bulunamadı</p>
                  )}
                </div>
                <Button variant="outline-secondary" onClick={onFilterReset}>
                  Tümünü Seç
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          {/* Filtre butonları */}
          <div className="filter-actions mt-4">
            <Button 
              variant="primary" 
              className="apply-filter-btn"
              onClick={onFilterApply}
              disabled={!selectedCategories.length && !selectedBrands.length && !priceRange.min && !priceRange.max}
            >
              Filtreleri Uygula
            </Button>
            <Button 
              variant="outline-secondary" 
              className="reset-filter-btn mt-2"
              onClick={onFilterReset}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter; 