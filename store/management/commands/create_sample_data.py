import random
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.db import transaction
from oscar.core.loading import get_model, get_class

# Oscar modelleri
Product = get_model('catalogue', 'Product')
ProductClass = get_model('catalogue', 'ProductClass')
ProductCategory = get_model('catalogue', 'ProductCategory')
Category = get_model('catalogue', 'Category')
StockRecord = get_model('partner', 'StockRecord')
Partner = get_model('partner', 'Partner')
ProductImage = get_model('catalogue', 'ProductImage')
ProductAttributeValue = get_model('catalogue', 'ProductAttributeValue')
ProductAttribute = get_model('catalogue', 'ProductAttribute')

strategy = get_class('partner.strategy', 'Default')()


class Command(BaseCommand):
    help = 'Oscar e-ticaret sistemi için örnek veriler oluşturur'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Örnek veriler oluşturuluyor...'))
        
        try:
            with transaction.atomic():
                self.create_superuser()
                self.create_partner()
                self.create_product_classes()
                self.create_categories()
                self.create_products()

                self.stdout.write(self.style.SUCCESS('Örnek veriler başarıyla oluşturuldu!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Hata oluştu: {str(e)}'))

    def create_superuser(self):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin')
            self.stdout.write(self.style.SUCCESS('Superuser "admin" oluşturuldu (şifre: admin)'))
        else:
            self.stdout.write('Admin kullanıcısı zaten mevcut')

    def create_partner(self):
        if not Partner.objects.filter(name='Default').exists():
            Partner.objects.create(name='Default')
            self.stdout.write(self.style.SUCCESS('Default partner oluşturuldu'))
        else:
            self.stdout.write('Default partner zaten mevcut')

    def create_product_classes(self):
        # Ürün sınıfları ve öznitelikleri
        product_classes = [
            {
                'name': 'Elektronik', 
                'attributes': [
                    {'name': 'Marka', 'code': 'brand', 'type': 'text'},
                    {'name': 'Garanti Süresi', 'code': 'warranty', 'type': 'text'},
                    {'name': 'Renk', 'code': 'color', 'type': 'text'},
                ]
            },
            {
                'name': 'Giyim', 
                'attributes': [
                    {'name': 'Marka', 'code': 'brand', 'type': 'text'},
                    {'name': 'Beden', 'code': 'size', 'type': 'text'},
                    {'name': 'Renk', 'code': 'color', 'type': 'text'},
                    {'name': 'Malzeme', 'code': 'material', 'type': 'text'},
                ]
            },
            {
                'name': 'Kitap', 
                'attributes': [
                    {'name': 'Yazar', 'code': 'author', 'type': 'text'},
                    {'name': 'Yayınevi', 'code': 'publisher', 'type': 'text'},
                    {'name': 'Sayfa Sayısı', 'code': 'pages', 'type': 'integer'},
                    {'name': 'ISBN', 'code': 'isbn', 'type': 'text'},
                ]
            },
            {
                'name': 'Ev & Yaşam', 
                'attributes': [
                    {'name': 'Marka', 'code': 'brand', 'type': 'text'},
                    {'name': 'Malzeme', 'code': 'material', 'type': 'text'},
                    {'name': 'Boyutlar', 'code': 'dimensions', 'type': 'text'},
                ]
            }
        ]
        
        for pc_data in product_classes:
            product_class, created = ProductClass.objects.get_or_create(
                name=pc_data['name'],
                defaults={
                    'requires_shipping': True,
                    'track_stock': True
                }
            )
            
            if created:
                self.stdout.write(f'"{pc_data["name"]}" ürün sınıfı oluşturuldu')
            
            # Öznitelikler oluşturuluyor
            for attr_data in pc_data['attributes']:
                attr, attr_created = ProductAttribute.objects.get_or_create(
                    name=attr_data['name'],
                    code=attr_data['code'],
                    product_class=product_class,
                    defaults={
                        'type': attr_data['type'],
                        'required': False
                    }
                )
                
                if attr_created:
                    self.stdout.write(f'"{attr_data["name"]}" özniteliği oluşturuldu')

    def create_categories(self):
        categories = [
            # Elektronik kategorileri
            {
                'name': 'Elektronik', 
                'subcategories': [
                    'Telefonlar',
                    'Tabletler',
                    'Bilgisayarlar',
                    'TV ve Ses Sistemleri',
                    'Kulaklıklar',
                    'Akıllı Saatler'
                ]
            },
            # Giyim kategorileri
            {
                'name': 'Giyim', 
                'subcategories': [
                    'Kadın Giyim',
                    'Erkek Giyim',
                    'Çocuk Giyim',
                    'Ayakkabı',
                    'Çanta',
                    'Aksesuar'
                ]
            },
            # Kitap kategorileri
            {
                'name': 'Kitap', 
                'subcategories': [
                    'Roman',
                    'Bilim Kurgu',
                    'Kişisel Gelişim',
                    'Çocuk Kitapları',
                    'Tarih',
                    'Bilim'
                ]
            },
            # Ev ve Yaşam kategorileri
            {
                'name': 'Ev & Yaşam', 
                'subcategories': [
                    'Mobilya',
                    'Mutfak',
                    'Dekorasyon',
                    'Aydınlatma',
                    'Banyo',
                    'Bahçe'
                ]
            }
        ]
        
        for cat_data in categories:
            # Ana kategori oluştur
            parent = self.create_category(cat_data['name'])
            
            # Alt kategoriler oluştur
            for subcat_name in cat_data['subcategories']:
                self.create_category(subcat_name, parent)
    
    def create_category(self, name, parent=None):
        """Kategori oluşturma yardımcı metodu"""
        slug = slugify(name)
        
        # Kategori zaten var mı kontrol et
        try:
            category = Category.objects.get(slug=slug)
            if parent and category.parent != parent:
                category.parent = parent
                category.save()
            return category
        except Category.DoesNotExist:
            pass
            
        # Yeni kategori oluştur
        category = Category(
            name=name,
            slug=slug,
        )
        
        if parent:
            category.path = f"{parent.path}{slug}/"
            category.depth = parent.depth + 1
            category.parent = parent
        else:
            category.path = f"{slug}/"
            category.depth = 1
        
        category.numchild = 0
        category.save()
        
        if parent:
            parent.numchild += 1
            parent.save()
            
        self.stdout.write(f'"{name}" kategorisi oluşturuldu')
        return category

    def create_products(self):
        partner = Partner.objects.get(name='Default')
        
        # Elektronik ürünleri
        electronics_data = [
            {
                'title': 'Samsung Galaxy S21', 
                'description': 'Samsung Galaxy S21 akıllı telefon, 6.2 inç ekran, 128GB depolama.', 
                'price': Decimal('9999.99'),
                'category': 'Telefonlar',
                'attributes': {
                    'brand': 'Samsung',
                    'warranty': '2 yıl',
                    'color': 'Siyah'
                }
            },
            {
                'title': 'Apple iPhone 13', 
                'description': 'iPhone 13, A15 Bionic çip, 6.1 inç Super Retina XDR ekran, 128GB depolama.', 
                'price': Decimal('15999.99'),
                'category': 'Telefonlar',
                'attributes': {
                    'brand': 'Apple',
                    'warranty': '2 yıl',
                    'color': 'Mavi'
                }
            },
            {
                'title': 'Xiaomi Redmi Note 11', 
                'description': 'Redmi Note 11, 6.43 inç AMOLED ekran, 128GB depolama, 50MP kamera.', 
                'price': Decimal('5999.99'),
                'category': 'Telefonlar',
                'attributes': {
                    'brand': 'Xiaomi',
                    'warranty': '2 yıl',
                    'color': 'Gri'
                }
            },
            {
                'title': 'Apple iPad Pro', 
                'description': 'iPad Pro, M1 çip, 11 inç Liquid Retina ekran, 256GB depolama.', 
                'price': Decimal('12999.99'),
                'category': 'Tabletler',
                'attributes': {
                    'brand': 'Apple',
                    'warranty': '2 yıl',
                    'color': 'Gümüş'
                }
            },
            {
                'title': 'Samsung Galaxy Tab S8', 
                'description': 'Galaxy Tab S8, 11 inç LCD ekran, 128GB depolama, S Pen dahil.', 
                'price': Decimal('10999.99'),
                'category': 'Tabletler',
                'attributes': {
                    'brand': 'Samsung',
                    'warranty': '2 yıl',
                    'color': 'Gri'
                }
            }
        ]
        
        # Giyim ürünleri
        clothing_data = [
            {
                'title': 'Basic T-shirt', 
                'description': 'Pamuklu basic t-shirt, düz renk, rahat kesim.', 
                'price': Decimal('149.99'),
                'category': 'Erkek Giyim',
                'attributes': {
                    'brand': 'LC Waikiki',
                    'size': 'M, L, XL',
                    'color': 'Beyaz, Siyah, Lacivert',
                    'material': '%100 Pamuk'
                }
            },
            {
                'title': 'Slim Fit Jean', 
                'description': 'Slim fit jean pantolon, orta bel, dar paça.', 
                'price': Decimal('299.99'),
                'category': 'Erkek Giyim',
                'attributes': {
                    'brand': 'DeFacto',
                    'size': '30/32, 32/32, 34/32',
                    'color': 'Mavi',
                    'material': '%98 Pamuk, %2 Elastan'
                }
            },
            {
                'title': 'Oversize Sweatshirt', 
                'description': 'Oversize sweatshirt, rahat kesim, kapüşonlu.', 
                'price': Decimal('199.99'),
                'category': 'Kadın Giyim',
                'attributes': {
                    'brand': 'Koton',
                    'size': 'S, M, L',
                    'color': 'Pembe, Gri',
                    'material': '%65 Pamuk, %35 Polyester'
                }
            }
        ]
        
        # Kitap ürünleri
        book_data = [
            {
                'title': '1984', 
                'description': 'George Orwell\'in distopik klasiği 1984, düşünce polisinin olduğu totaliter bir dünyayı anlatır.', 
                'price': Decimal('49.99'),
                'category': 'Roman',
                'attributes': {
                    'author': 'George Orwell',
                    'publisher': 'Can Yayınları',
                    'pages': 350,
                    'isbn': '9789750719387'
                }
            },
            {
                'title': 'Harry Potter ve Felsefe Taşı', 
                'description': 'J.K. Rowling\'in fantastik serisi Harry Potter\'ın ilk kitabı.', 
                'price': Decimal('59.99'),
                'category': 'Roman',
                'attributes': {
                    'author': 'J.K. Rowling',
                    'publisher': 'YKY',
                    'pages': 276,
                    'isbn': '9789750802690'
                }
            },
            {
                'title': 'Dune', 
                'description': 'Frank Herbert\'in bilim kurgu klasiği Dune, çöl gezegeni Arrakis\'te geçen bir epik.', 
                'price': Decimal('79.99'),
                'category': 'Bilim Kurgu',
                'attributes': {
                    'author': 'Frank Herbert',
                    'publisher': 'İthaki Yayınları',
                    'pages': 712,
                    'isbn': '9786053757818'
                }
            }
        ]
        
        # Ev ve Yaşam ürünleri
        home_data = [
            {
                'title': 'Çelik Tencere Seti', 
                'description': '5 parça çelik tencere seti, indüksiyonlu ocaklara uyumlu.', 
                'price': Decimal('699.99'),
                'category': 'Mutfak',
                'attributes': {
                    'brand': 'Karaca',
                    'material': 'Paslanmaz Çelik',
                    'dimensions': '5 Parça'
                }
            },
            {
                'title': 'Modern TV Ünitesi', 
                'description': 'Modern tasarımlı TV ünitesi, LED aydınlatmalı, geniş depolama alanı.', 
                'price': Decimal('1499.99'),
                'category': 'Mobilya',
                'attributes': {
                    'brand': 'Bellona',
                    'material': 'Suntalam',
                    'dimensions': '180x45x50 cm'
                }
            },
            {
                'title': 'LED Avize', 
                'description': 'Modern LED avize, uzaktan kumandalı, 3 farklı ışık modu.', 
                'price': Decimal('599.99'),
                'category': 'Aydınlatma',
                'attributes': {
                    'brand': 'Şavk',
                    'material': 'Metal, Akrilik',
                    'dimensions': '60x60x15 cm'
                }
            }
        ]
        
        # Ürün verilerini birleştir
        all_products_data = []
        all_products_data.extend([{'data': p, 'product_class': 'Elektronik'} for p in electronics_data])
        all_products_data.extend([{'data': p, 'product_class': 'Giyim'} for p in clothing_data])
        all_products_data.extend([{'data': p, 'product_class': 'Kitap'} for p in book_data])
        all_products_data.extend([{'data': p, 'product_class': 'Ev & Yaşam'} for p in home_data])
        
        # Ürünleri oluştur
        for product_info in all_products_data:
            product_data = product_info['data']
            product_class_name = product_info['product_class']
            
            # Ürün sınıfı
            product_class = ProductClass.objects.get(name=product_class_name)
            
            # Kategori
            try:
                category = Category.objects.get(name=product_data['category'])
                
                # Ürün oluştur
                product, created = Product.objects.get_or_create(
                    title=product_data['title'],
                    defaults={
                        'description': product_data['description'],
                        'product_class': product_class,
                        'is_discountable': True,
                    }
                )
                
                if created:
                    self.stdout.write(f'"{product_data["title"]}" ürünü oluşturuldu')
                    
                    # Kategori ilişkisi
                    ProductCategory.objects.create(product=product, category=category)
                    
                    # Stok kaydı
                    StockRecord.objects.create(
                        product=product,
                        partner=partner,
                        partner_sku=f'SKU-{slugify(product_data["title"])}',
                        price=product_data['price'],
                        num_in_stock=random.randint(10, 100)
                    )
                    
                    # Öznitelikler
                    if 'attributes' in product_data:
                        for code, value in product_data['attributes'].items():
                            try:
                                attr = ProductAttribute.objects.get(code=code, product_class=product_class)
                                ProductAttributeValue.objects.create(
                                    product=product,
                                    attribute=attr,
                                    value_text=str(value)
                                )
                            except ProductAttribute.DoesNotExist:
                                self.stdout.write(self.style.WARNING(f'"{code}" özniteliği bulunamadı'))
                else:
                    self.stdout.write(f'"{product_data["title"]}" ürünü zaten mevcut')
            except Category.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'"{product_data["category"]}" kategorisi bulunamadı')) 