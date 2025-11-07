
import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import type { Product, User, CartItem, Order, Testimonial, FAQ } from './types';
import { Page } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// MOCK DATA
const PRODUCTS: Product[] = [
    { id: '1', name: 'Urban Runner', category: 'Sneakers', price: 120, rating: 4.5, reviewCount: 150, images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'Lightweight sneakers for the modern urban explorer.', isFeatured: true },
    { id: '2', name: 'Classic Oxford', category: 'Formal', price: 250, originalPrice: 300, rating: 4.8, reviewCount: 210, images: ['https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/450212/pexels-photo-450212.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'Timeless elegance for any formal occasion.' },
    { id: '3', name: 'Mountain Trekker', category: 'Boots', price: 180, rating: 4.7, reviewCount: 320, images: ['https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'Durable and comfortable boots for your next adventure.', isFeatured: true },
    { id: '4', name: 'Beach Slider', category: 'Sandals', price: 50, rating: 4.2, reviewCount: 80, images: ['https://images.pexels.com/photos/1630325/pexels-photo-1630325.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/267211/pexels-photo-267211.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'Comfortable and stylish sliders for a relaxed day.' },
    { id: '5', name: 'Cityscape Loafer', category: 'Formal', price: 160, rating: 4.6, reviewCount: 110, images: ['https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1461048/pexels-photo-1461048.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'A perfect blend of comfort and semi-formal style.' },
    { id: '6', name: 'High-Top Kicks', category: 'Sneakers', price: 140, originalPrice: 160, rating: 4.4, reviewCount: 190, images: ['https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1102797/pexels-photo-1102797.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'Street-style high-tops with superior ankle support.', isFeatured: true },
    { id: '7', name: 'Executive Derby', category: 'Formal', price: 280, rating: 4.9, reviewCount: 150, images: ['https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'Premium leather shoes for the discerning professional.'},
    { id: '8', name: 'Trail Blazer', category: 'Boots', price: 200, rating: 4.8, reviewCount: 400, images: ['https://images.pexels.com/photos/609771/pexels-photo-609771.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1261000/pexels-photo-1261000.jpeg?auto=compress&cs=tinysrgb&w=800'], description: 'Rugged, waterproof boots for the toughest terrains.'},
];
const TESTIMONIALS: Testimonial[] = [
    { name: 'Aarav Patel', role: 'Fashion Blogger', quote: "Warehouse Footwear has the best collection in Gujarat! The quality is unmatched and the styles are always on trend.", avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2&fit=crop' },
    { name: 'Priya Sharma', role: 'Frequent Shopper', quote: "I've bought 5 pairs from here and I'm always delighted. Fast delivery and excellent customer service.", avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2&fit=crop' },
];
const FAQS: FAQ[] = [
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for unused products in their original packaging. Please visit our returns page for more details.' },
    { question: 'Do you ship all over India?', answer: 'Yes, we provide shipping across India. Delivery times may vary based on your location.' },
    { question: 'How can I track my order?', answer: 'Once your order is shipped, you will receive an email with a tracking link to monitor your delivery status.' },
];

// CONTEXTS
type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void; } | null>(null);
const AuthContext = createContext<{ user: User | null; login: (user: User) => void; logout: () => void; } | null>(null);
const CartContext = createContext<{ cart: CartItem[]; addToCart: (product: Product, quantity?: number) => void; removeFromCart: (productId: string) => void; updateQuantity: (productId: string, quantity: number) => void; clearCart: () => void; } | null>(null);

// PROVIDERS
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const login = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };
    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    const addToCart = (product: Product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prevCart, { product, quantity }];
        });
    };
    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart => prevCart.map(item => item.product.id === productId ? { ...item, quantity } : item));
        }
    };
    const clearCart = () => setCart([]);
    return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>{children}</CartContext.Provider>;
};

// CUSTOM HOOKS
const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

// HELPER & UI COMPONENTS
const Logo: React.FC = () => (
    <div className="flex items-center justify-center w-12 h-12 bg-black dark:bg-white rounded-full">
        <span className="text-3xl font-extrabold text-white dark:text-black">W</span>
    </div>
);

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full text-secondary-dark dark:text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
        </button>
    );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
}
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = "px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto";
    const variantClasses = {
        primary: 'bg-black dark:bg-white text-white dark:text-black focus:ring-black dark:focus:ring-white',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-gray-400',
        danger: 'bg-red-600 text-white focus:ring-red-500',
    };
    return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>;
};

interface ProductCardProps {
    product: Product;
    onView: () => void;
}
const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
    const { addToCart } = useCart();
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group">
            <div className="relative">
                <img className="w-full h-56 object-cover" src={product.images[0]} alt={product.name} />
                <div className="absolute top-0 right-0 bg-primary text-secondary p-2 rounded-bl-xl">{product.category}</div>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-extrabold text-black dark:text-primary-dark">${product.price}</p>
                    {product.originalPrice && <p className="text-md text-gray-500 line-through">${product.originalPrice}</p>}
                </div>
                <div className="flex items-center mt-2">
                     {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                    <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">({product.reviewCount} reviews)</span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button onClick={onView} variant="secondary" className="flex-1">View Details</Button>
                    <Button onClick={() => addToCart(product)} className="flex-1">Add to Cart</Button>
                </div>
            </div>
        </div>
    );
};

// PAGE COMPONENTS
interface PageProps {
    setPage: (page: Page, params?: any) => void;
}

const HomePage: React.FC<PageProps> = ({ setPage }) => (
    <div className="bg-yellow-400 dark:bg-gray-900 text-black dark:text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
            <Logo />
            <h1 className="text-4xl md:text-6xl font-extrabold mt-6">Step into Gujarat’s Style</h1>
            <p className="text-xl md:text-2xl mt-4 font-light">with Warehouse Footwear</p>
            <p className="mt-6 max-w-2xl text-secondary dark:text-secondary-dark">Discover our exclusive collection of premium footwear, crafted with passion and precision. Comfort, style, and durability in every step.</p>
            <Button onClick={() => setPage(Page.Products)} className="mt-8 text-lg">Explore Shoes</Button>
        </div>

        {/* Featured Products */}
        <div className="bg-gray-100 dark:bg-gray-950 py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PRODUCTS.filter(p => p.isFeatured).map(product => (
                        <ProductCard key={product.id} product={product} onView={() => setPage(Page.ProductDetail, product.id)} />
                    ))}
                </div>
            </div>
        </div>
        
        {/* Testimonials */}
        <div className="bg-yellow-400 dark:bg-gray-900 py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">What Our Customers Say</h2>
                <div className="flex flex-col md:flex-row gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex-1">
                            <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mx-auto -mt-16 border-4 border-white dark:border-gray-800" />
                            <p className="text-gray-600 dark:text-gray-300 mt-4 text-center italic">"{t.quote}"</p>
                            <p className="text-center font-bold text-lg mt-4 text-black dark:text-white">{t.name}</p>
                            <p className="text-center text-primary-dark dark:text-primary text-sm">{t.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-100 dark:bg-gray-950 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <details>
                                <summary className="font-semibold text-lg cursor-pointer text-black dark:text-white">{faq.question}</summary>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ProductsPage: React.FC<PageProps> = ({ setPage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ category: 'all', price: 1000, sort: 'popularity' });
    const filteredProducts = useMemo(() => {
        return PRODUCTS
            .filter(p => searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
            .filter(p => filters.category === 'all' ? true : p.category === filters.category)
            .filter(p => p.price <= filters.price)
            .sort((a, b) => {
                if(filters.sort === 'price-asc') return a.price - b.price;
                if(filters.sort === 'price-desc') return b.price - a.price;
                return b.rating * b.reviewCount - a.rating * a.reviewCount; // Popularity
            });
    }, [searchTerm, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters */}
                <aside className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-fit">
                    <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Filters</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                            <input type="text" id="search" placeholder="Search for shoes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md p-2 focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md p-2 focus:ring-primary focus:border-primary">
                                <option value="all">All</option>
                                <option value="Sneakers">Sneakers</option>
                                <option value="Formal">Formal</option>
                                <option value="Boots">Boots</option>
                                <option value="Sandals">Sandals</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price: ${filters.price}</label>
                            <input type="range" id="price" name="price" min="50" max="300" step="10" value={filters.price} onChange={handleFilterChange} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                        </div>
                        <div>
                            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                            <select id="sort" name="sort" value={filters.sort} onChange={handleFilterChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md p-2 focus:ring-primary focus:border-primary">
                                <option value="popularity">Popularity</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </aside>
                {/* Product Grid */}
                <main className="w-full md:w-3/4">
                    <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Our Collection ({filteredProducts.length})</h2>
                    {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onView={() => setPage(Page.ProductDetail, product.id)} />
                        ))}
                    </div>
                     ) : (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                            <p className="text-2xl">No shoes found!</p>
                            <p>Try adjusting your filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

interface ProductDetailPageProps extends PageProps {
    productId: string;
}
const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ setPage, productId }) => {
    const { addToCart } = useCart();
    const product = PRODUCTS.find(p => p.id === productId);
    const [selectedImage, setSelectedImage] = useState(product?.images[0] || '');

    if (!product) {
        return <div className="text-center py-20 text-black dark:text-white">Product not found. <Button onClick={() => setPage(Page.Products)}>Back to Products</Button></div>;
    }

    const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                <button onClick={() => setPage(Page.Products)} className="mb-6 text-primary hover:underline">&larr; Back to all products</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <img src={selectedImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md aspect-square"/>
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                            {product.images.map(img => (
                                <img key={img} src={img} alt="" className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`} onClick={() => setSelectedImage(img)}/>
                            ))}
                        </div>
                    </div>
                    {/* Product Info */}
                    <div>
                        <span className="text-primary font-semibold">{product.category}</span>
                        <h1 className="text-4xl font-extrabold mt-2 text-black dark:text-white">{product.name}</h1>
                        <div className="flex items-center mt-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                            <span className="text-gray-600 dark:text-gray-400 ml-2">{product.rating} ({product.reviewCount} reviews)</span>
                        </div>
                        <div className="my-6">
                            <span className="text-4xl font-bold text-black dark:text-primary-dark">${product.price}</span>
                            {product.originalPrice && <span className="text-xl text-gray-500 line-through ml-4">${product.originalPrice}</span>}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => { addToCart(product); alert(`${product.name} added to cart!`); }} className="flex-1">Add to Cart</Button>
                            <Button onClick={() => { addToCart(product); setPage(Page.Cart); }} variant="secondary" className="flex-1">Buy Now</Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Related Products */}
            {relatedProducts.length > 0 && <div className="mt-16">
                <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedProducts.map(p => <ProductCard key={p.id} product={p} onView={() => setPage(Page.ProductDetail, p.id)} />)}
                </div>
            </div>}
        </div>
    );
};

const CartPage: React.FC<PageProps> = ({ setPage }) => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div className="text-center py-20 container mx-auto text-black dark:text-white">
                <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
                <p className="mt-4">Looks like you haven't added anything to your cart yet.</p>
                <Button onClick={() => setPage(Page.Products)} className="mt-6">Continue Shopping</Button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Your Cart</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3 space-y-4">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-md"/>
                            <div className="ml-4 flex-grow">
                                <h2 className="font-bold text-lg text-black dark:text-white">{item.product.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400">${item.product.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))} className="w-16 p-1 text-center bg-gray-100 dark:bg-gray-700 rounded"/>
                                <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-red-500 hover:text-red-700">&times;</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={clearCart} className="text-red-500 hover:underline mt-4">Clear Cart</button>
                </div>
                <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300"><p>Subtotal</p> <p>${subtotal.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-700 dark:text-gray-300"><p>Taxes (18%)</p> <p>${tax.toFixed(2)}</p></div>
                        <hr className="my-2 border-gray-200 dark:border-gray-700"/>
                        <div className="flex justify-between text-xl font-bold text-black dark:text-white"><p>Total</p> <p>${total.toFixed(2)}</p></div>
                    </div>
                    <Button className="mt-6 w-full">Proceed to Checkout</Button>
                </div>
            </div>
        </div>
    );
}

const LoginPage: React.FC<PageProps> = ({ setPage }) => {
    const { login } = useAuth();
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login
        const isAdmin = (e.target as any).email.value === 'admin@warehouse.com';
        login({ id: '1', name: isAdmin ? 'Admin User' : 'Test User', email: (e.target as any).email.value, role: isAdmin ? 'admin' : 'customer' });
        setPage(Page.Home);
    };
    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-black dark:text-white">Login</h2>
                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <input type="email" name="email" placeholder="Email (use admin@warehouse.com for admin)" required className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-md"/>
                    <input type="password" placeholder="Password" required className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-md"/>
                    <Button type="submit" className="w-full">Sign In</Button>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account? <button onClick={() => setPage(Page.Signup)} className="font-medium text-primary hover:underline">Sign Up</button>
                    </p>
                </form>
            </div>
        </div>
    );
};

// ... other page components like Signup, Profile, Orders, AdminDashboard would follow a similar structure

// LAYOUT COMPONENTS
const AppHeader: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button onClick={() => setPage(Page.Home)} className="flex items-center gap-3">
                    <Logo />
                    <span className="text-2xl font-bold text-black dark:text-white hidden sm:block">Warehouse</span>
                </button>
                <div className="hidden md:flex gap-6 items-center">
                    <button onClick={() => setPage(Page.Home)} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark">Home</button>
                    <button onClick={() => setPage(Page.Products)} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark">Products</button>
                    {user?.role === 'admin' && <button onClick={() => setPage(Page.AdminDashboard)} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark">Admin</button>}
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => setPage(Page.Cart)} className="relative p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary dark:text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {cart.length > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cart.reduce((t, i) => t + i.quantity, 0)}</span>}
                    </button>
                    {user ? (
                        <div className="relative group">
                             <button onClick={() => setPage(Page.Profile)} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-black">{user.name.charAt(0)}</button>
                             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 hidden group-hover:block">
                                <button onClick={() => setPage(Page.Profile)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Profile</button>
                                <button onClick={() => setPage(Page.Orders)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">My Orders</button>
                                <button onClick={() => { logout(); setPage(Page.Home); }} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600">Logout</button>
                             </div>
                        </div>
                    ) : (
                        <Button onClick={() => setPage(Page.Login)} variant="secondary" className="px-4 py-2">Login</Button>
                    )}
                </div>
            </nav>
        </header>
    );
};

const AppFooter: React.FC = () => (
    <footer className="bg-black text-white py-10">
        <div className="container mx-auto px-4 text-center">
            <Logo />
            <p className="mt-4">Warehouse Footwear - Gujarat's finest.</p>
            <p className="text-sm text-gray-400 mt-2">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
    </footer>
);

const BottomNav: React.FC<{ page: Page, setPage: (page: Page) => void }> = ({ page, setPage }) => {
    const navItems = [
        { page: Page.Home, label: 'Home', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { page: Page.Products, label: 'Products', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg> },
        { page: Page.Cart, label: 'Cart', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { page: Page.Profile, label: 'Profile', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    ];
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-around">
                {navItems.map(item => (
                    <button key={item.page} onClick={() => setPage(item.page)} className={`flex flex-col items-center justify-center p-3 w-full ${page === item.page ? 'text-primary' : 'text-gray-500'}`}>
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [pageParams, setPageParams] = useState<any>(null);

    const setPage = useCallback((page: Page, params: any = null) => {
        setCurrentPage(page);
        setPageParams(params);
        window.scrollTo(0, 0);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case Page.Home: return <HomePage setPage={setPage} />;
            case Page.Products: return <ProductsPage setPage={setPage} />;
            case Page.ProductDetail: return <ProductDetailPage setPage={setPage} productId={pageParams} />;
            case Page.Cart: return <CartPage setPage={setPage} />;
            case Page.Login: return <LoginPage setPage={setPage} />;
            // Add other pages here. For brevity, some are omitted.
            default: return <HomePage setPage={setPage} />;
        }
    };
    
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <div className="flex flex-col min-h-screen font-sans">
                        <AppHeader setPage={setPage} />
                        <main className="flex-grow pb-16 md:pb-0">
                           {renderPage()}
                        </main>
                        <AppFooter />
                        <BottomNav page={currentPage} setPage={setPage} />
                    </div>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
