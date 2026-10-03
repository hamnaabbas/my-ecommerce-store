import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from .models import Product, Order, OrderItem, CartItem
from django.contrib.auth.forms import AuthenticationForm
from .forms import SignUpForm

def signup_view(request):
    if request.user.is_authenticated:
        return redirect('index')
        
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password']) # Secure password hashing
            user.save()
            login(request, user)
            return redirect('index')
    else:
        form = SignUpForm()
    return render(request, 'store/signup.html', {'form': form})

def login_view(request):
    if request.user.is_authenticated:
        return redirect('index')
        
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, "Invalid username/email or password.")
    else:
        form = AuthenticationForm()
        
    return render(request, 'store/login.html', {'form': form})

@login_required(login_url='login')
def index_view(request):
    """Protected profile/dashboard page showing authenticated user details."""
    return render(request, 'store/index.html', {'user': request.user})

def logout_view(request):
    logout(request)
    return redirect('login')

from .models import Category  # Yakeeni banayein ke Category import ho

def all_categories(request):
    categories = Category.objects.all()
    context = {
        'categories': categories
    }
    # Yahan path mein 'store/' shamil kar dein
    return render(request, 'store/all_categories.html', context)

def index(request):
    products = Product.objects.all()
    categories = Category.objects.all()  # <--- Yeh line add karein
    best_sellers = Product.objects.filter(is_best_seller=True)
    categories = Category.objects.all()
    cart_count = 0

    if request.user.is_authenticated:
        cart_count = CartItem.objects.filter(user=request.user).count()
    
    context = {
        'products': products,
        'categories': categories,
        'cart_count': cart_count,
        'best_sellers': best_sellers,
        'categories': categories,
        'cart_count': cart_count,
    }
    return render(request, 'store/index.html', context) # Make sure your template matches or use index_2.html renamed


def add_to_cart(request, product_id):
    if not request.user.is_authenticated:
        return redirect('login')
    
    product = get_object_or_404(Product, id=product_id)
    cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)
    
    if not created:
        cart_item.quantity += 1
        cart_item.save()
        
    return redirect(request.META.get('HTTP_REFERER', 'index'))

def cart_detail(request):
    if not request.user.is_authenticated:
        return redirect('login')
    
    cart_items = CartItem.objects.filter(user=request.user)
    total = sum(item.product.price * item.quantity for item in cart_items)
    
    context = {
        'cart_items': cart_items,
        'total': total,
    }
    return render(request, 'store/cart.html', context)

def api_products(request):
    products = Product.objects.all()
    products_data = []
    for p in products:
        products_data.append({
            'id': p.id,
            'title': p.title, 
            'price': float(p.price),
        })
    return JsonResponse(products_data, safe=False)

def product_detail(request, id):
    product = get_object_or_404(Product, id=id)
    products = Product.objects.all()
    context = {'products': products}
    return render(request, "store/product_detail.html", {"product": product})

def remove_from_cart(request, item_id):  # Yahan id ki jagah item_id likh dein
    if request.user.is_authenticated:
        cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
        cart_item.delete()
    return redirect('cart')

def checkout(request):
    if not request.user.is_authenticated:
        return redirect('login')
        
    cart_items = CartItem.objects.filter(user=request.user)
    if not cart_items.exists():
        messages.error(request, "Your cart is empty!")
        return redirect("cart_view")

    total = sum(item.subtotal for item in cart_items)

    if request.method == "POST":
        address = request.POST.get("address")

        order = Order.objects.create(
            user=request.user,
            total_price=total,
            shipping_address=address,
            is_paid=True
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # Clear user cart after order
        cart_items.delete()
        return render(request, "store/order_success.html", {"order": order})

    context = {
        'total': total,
        'cart_items': cart_items
    }
    return render(request, "store/checkout.html", context)

# Auth & Static Views
@login_required
def profile_view(request):
    return render(request, 'store/profile.html')

def about_view(request):
    return render(request, 'store/about.html')

# API Endpoints
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})

@ensure_csrf_cookie
def api_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            fullname = data.get('fullname')
            email = data.get('email')
            password = data.get('password')
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already registered!'}, status=400)
            
            User.objects.create_user(username=email, email=email, password=password, first_name=fullname)
            return JsonResponse({'message': 'Account created successfully!'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@ensure_csrf_cookie
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'message': 'Login successful!', 'username': user.first_name or user.username}, status=200)
            else:
                return JsonResponse({'error': 'Invalid email or password.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)

def api_logout(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully!'}, status=200)


def cart_view(request):
    cart_items = []
    cart_count = 0
    # Agar user logged in hai, toh uske cart items database se nikalen
    if request.user.is_authenticated:
        cart_items = CartItem.objects.filter(user=request.user)
        cart_count = cart_items.count()
    else:
        # Agar user login nahi hai (agar guest cart hai toh session handle karein)
        cart_items = []
        crt_count =0
        
    context = {
        'cart_items': cart_items,
        'cart_count': cart_count,
    }
    return render(request, 'store/cart.html', context)

def category_products(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug)
    products = Product.objects.filter(category=category, available=True)
    
    context = {
        'category': category,
        'products': products,
    }
    return render(request, 'store/category_products.html', context)

