from django.urls import path, re_path
from . import views

urlpatterns = [
    path('categories/', views.categories_redirect, name='categories_redirect'),
    path('products/<int:product_id>/categories/', views.product_categories_redirect, name='product_categories_redirect'),
    path('products/', views.products_transform, name='products_transform'),
    path('products/<int:product_id>/', views.product_detail_transform, name='product_detail_transform'),
    
    # Yeni catalogue yönlendirmeleri
    re_path(r'^catalogue/categories/(?P<path>.*)$', views.catalogue_categories_redirect, name='catalogue_categories_redirect'),
    re_path(r'^catalogue/products/(?P<path>.*)$', views.catalogue_products_redirect, name='catalogue_products_redirect'),
    
    # Kullanıcı kayıt endpoint'i
    path('register/', views.register, name='register'),
] 