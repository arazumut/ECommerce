from django.http import JsonResponse
import requests
from django.conf import settings
import json

def categories_redirect(request):
    """
    /api/categories/ URL'inden gelen istekleri /api/catalogue/categories/ URL'ine yönlendiren view
    """
    try:
        # Oscar API'nin categories endpoint'ine istek gönder
        response = requests.get(request.build_absolute_uri().replace('/api/categories/', '/api/catalogue/categories/'))
        
        # Oscar API'den gelen yanıtı al
        if response.status_code == 200:
            # Başarılı yanıtı doğrudan ilet
            return JsonResponse(response.json(), safe=False)
    except Exception as e:
        print(f"Kategori yönlendirmesinde hata: {e}")
    
    # Hata durumunda varsayılan kategori listesi
    default_categories = [
        {"id": 1, "name": "Elektronik", "slug": "elektronik", "image": "/static/img/categories/elektronik.jpg"},
        {"id": 2, "name": "Giyim", "slug": "giyim", "image": "/static/img/categories/giyim.jpg"},
        {"id": 3, "name": "Kitap", "slug": "kitap", "image": "/static/img/categories/kitap.jpg"},
        {"id": 4, "name": "Ev & Yaşam", "slug": "ev-yasam", "image": "/static/img/categories/ev-yasam.jpg"}
    ]
    return JsonResponse(default_categories, safe=False)

def product_categories_redirect(request, product_id):
    """
    /api/products/{id}/categories/ URL'inden gelen istekleri yönlendiren view
    """
    # Oscar API'nin product categories endpoint'ine istek gönder
    response = requests.get(request.build_absolute_uri().replace(
        f'/api/products/{product_id}/categories/', 
        f'/api/catalogue/products/{product_id}/categories/'
    ))
    
    # Oscar API'den gelen yanıtı al
    if response.status_code == 200:
        return JsonResponse(response.json(), safe=False)
    else:
        return JsonResponse([], safe=False)

def transform_product_data(product, request):
    """
    Ürün verilerini frontend'in anlayacağı formata dönüştürür
    """
    if not product:
        return product
    
    # Varsayılan placeholder resmi
    placeholder_image = '/static/img/placeholder.jpg'
    
    # Resim URL'lerini düzelt
    if 'images' in product and isinstance(product['images'], list):
        # Eğer images listesi boşsa, placeholder ekle
        if len(product['images']) == 0:
            product['images'] = [placeholder_image]
        else:
            # Her image için tam URL oluştur
            for i, image in enumerate(product['images']):
                if isinstance(image, dict) and 'original' in image:
                    product['images'][i] = request.build_absolute_uri(image['original'])
                elif isinstance(image, str) and not image.startswith('http'):
                    product['images'][i] = request.build_absolute_uri(image)
    
    # Ana ürün resmini de ayarla
    if 'image' not in product or not product['image']:
        if 'images' in product and len(product['images']) > 0:
            product['image'] = product['images'][0]
        else:
            product['image'] = placeholder_image
    
    return product

def products_transform(request):
    """
    /api/products/ endpoint'inden gelen verileri dönüştüren view
    """
    # Orijinal istek parametrelerini al
    query_params = request.GET.urlencode()
    
    # Oscar API'nin products endpoint'ine istek gönder
    api_url = f"{request.build_absolute_uri('/api/catalogue/products/')}"
    if query_params:
        api_url += f"?{query_params}"
    
    response = requests.get(api_url)
    
    # Oscar API'den gelen yanıtı al
    if response.status_code == 200:
        data = response.json()
        
        # Liste formatındaysa, her bir ürünü dönüştür
        if isinstance(data, list):
            transformed_data = [transform_product_data(product, request) for product in data]
            return JsonResponse(transformed_data, safe=False)
        # Sayfalı sonuçsa, her bir sonucu dönüştür
        elif isinstance(data, dict) and 'results' in data:
            data['results'] = [transform_product_data(product, request) for product in data['results']]
            return JsonResponse(data, safe=False)
        # Tek bir ürünse, doğrudan dönüştür
        else:
            transformed_data = transform_product_data(data, request)
            return JsonResponse(transformed_data, safe=False)
    else:
        # Hata durumunda boş liste döndür
        return JsonResponse([], safe=False)

def product_detail_transform(request, product_id):
    """
    /api/products/{id}/ endpoint'inden gelen verileri dönüştüren view
    """
    # Oscar API'nin product detail endpoint'ine istek gönder
    api_url = f"{request.build_absolute_uri(f'/api/catalogue/products/{product_id}/')}"
    
    response = requests.get(api_url)
    
    # Oscar API'den gelen yanıtı al
    if response.status_code == 200:
        data = response.json()
        transformed_data = transform_product_data(data, request)
        return JsonResponse(transformed_data, safe=False)
    else:
        # Hata durumunda
        return JsonResponse({}, safe=False) 