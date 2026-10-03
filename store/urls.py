from django.urls import path
from . import views

urlpatterns = [
    # Main Store Pages & Aliases
    path('', views.index, name='index'),
    path('product/', views.index, name='product_list'),  # Alias for templates using product_list
    path('product/<int:id>/', views.product_detail, name='product_detail'),
    
    # Cart & Checkout
    path('cart/', views.cart_view, name='cart_view'),
    path('cart/', views.cart_view, name='cart'),  # Alias for templates using cart
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:id>/', views.remove_from_cart, name='remove_from_cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('category//', views.category_products, name='category_products'),
    
    # API & Products JSON
    path('api/products/', views.api_products, name='api_products'),
    path('remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    # Auth & Static Views
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('profile/', views.profile_view, name='profile'),
    path('about/', views.about_view, name='about'),
    path('logout/', views.logout_view, name='logout'),
    # API Endpoints
    path('api/login/', views.api_login, name='api_login'),
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/logout/', views.api_logout, name='api_logout'),
    path('api/csrf/', views.get_csrf_token, name='get_csrf_token'),
    path('categories/', views.all_categories, name='all_categories'),
]