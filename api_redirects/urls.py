from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.categories_redirect, name='categories_redirect'),
    path('products/<int:product_id>/categories/', views.product_categories_redirect, name='product_categories_redirect'),
    path('products/', views.products_transform, name='products_transform'),
    path('products/<int:product_id>/', views.product_detail_transform, name='product_detail_transform'),
] 