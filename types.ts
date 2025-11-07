
export interface Product {
  id: string;
  name: string;
  category: 'Sneakers' | 'Formal' | 'Boots' | 'Sandals';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export enum Page {
    Home = 'home',
    Products = 'products',
    ProductDetail = 'product-detail',
    Cart = 'cart',
    Profile = 'profile',
    Orders = 'orders',
    Login = 'login',
    Signup = 'signup',
    AdminDashboard = 'admin-dashboard',
}
