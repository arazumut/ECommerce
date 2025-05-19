from django.http import JsonResponse, HttpResponse
import requests
from django.conf import settings
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt

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

def catalogue_categories_redirect(request, path=''):
    """
    /api/catalogue/categories/* URL'lerini işlemek için yönlendirme fonksiyonu
    """
    # Orijinal URL'den istek parametrelerini al
    query_params = request.GET.urlencode()
    
    # Yeni URL oluştur (api/ öneki yerine api/catalogue/ önekini kullan)
    api_url = f"{request.build_absolute_uri('/api/categories/')}"
    if path:
        api_url = f"{api_url}{path}"
    if query_params:
        api_url += f"?{query_params}"
    
    response = requests.get(api_url)
    
    # API'den gelen yanıtı doğrudan döndür
    return HttpResponse(
        content=response.content,
        status=response.status_code,
        content_type=response.headers.get('Content-Type', 'application/json')
    )

def catalogue_products_redirect(request, path=''):
    """
    /api/catalogue/products/* URL'lerini işlemek için yönlendirme fonksiyonu
    """
    # Orijinal URL'den istek parametrelerini al
    query_params = request.GET.urlencode()
    
    # Yeni URL oluştur (api/ öneki yerine api/catalogue/ önekini kullan)
    api_url = f"{request.build_absolute_uri('/api/products/')}"
    if path:
        api_url = f"{api_url}{path}"
    if query_params:
        api_url += f"?{query_params}"
    
    response = requests.get(api_url)
    
    # API'den gelen yanıtı doğrudan döndür
    return HttpResponse(
        content=response.content,
        status=response.status_code,
        content_type=response.headers.get('Content-Type', 'application/json')
    )

@csrf_exempt
def register(request):
    """
    Kullanıcı kayıt API endpoint'i
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            
            # Tüm gerekli alanların varlığını kontrol et
            if not all([username, email, password]):
                return JsonResponse({
                    'status': 'error',
                    'message': 'Kullanıcı adı, e-posta ve şifre gereklidir.'
                }, status=400)
            
            # Kullanıcının var olup olmadığını kontrol et
            if User.objects.filter(username=username).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Bu kullanıcı adı zaten kullanılıyor.'
                }, status=400)
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Bu e-posta adresi zaten kullanılıyor.'
                }, status=400)
            
            # Yeni kullanıcı oluştur
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Kaydı tamamla ve kullanıcıyı giriş yap
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({
                    'status': 'success',
                    'message': 'Kayıt başarıyla tamamlandı!',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                })
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Kayıt yapıldı ancak otomatik giriş başarısız oldu.'
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Geçersiz JSON formatı.'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Bir hata oluştu: {str(e)}'
            }, status=500)
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Yalnızca POST istekleri kabul edilir.'
        }, status=405) 