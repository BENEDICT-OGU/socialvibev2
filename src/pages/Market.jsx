import React, { useState, useEffect, useRef } from "react";
import {
  CloudUploadIcon,
  PhotographIcon,
  XIcon,
  ShoppingCartIcon,
  StarIcon,
  SearchIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon,
  TagIcon,
  TruckIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  FilterIcon,
  HeartIcon,
  EyeIcon,
  LightningBoltIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const MarketplaceApp = () => {
  // App state
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    category: "",
    rating: 0,
    inStock: false,
  });
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
    stock: 0,
    images: [],
    videos: [],
    variants: [],
    category: "",
    tags: [],
    isPublished: false,
    isDigital: false,
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Mock data initialization
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          title: "Premium Wireless Headphones",
          price: 199.99,
          description: "Noise-cancelling wireless headphones with 30hr battery",
          stock: 15,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/2.jpg?1108",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/3.jpg?1108",
          ],
          rating: 4.5,
          category: "Electronics",
          tags: ["audio", "wireless"],
          variants: [
            { color: "Black", price: 199.99, stock: 10 },
            { color: "Silver", price: 219.99, stock: 5 },
          ],
          isOnSale: true,
          discount: 15,
        },
        {
          id: 2,
          title: "Smartphone X Pro",
          price: 999.99,
          description: "Latest flagship smartphone with pro camera system",
          stock: 8,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/10/9460283/1.jpg?4186",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/10/9460283/2.jpg?4186",
          ],
          rating: 4.8,
          category: "Electronics",
          tags: ["mobile", "smartphone"],
          variants: [
            { color: "Midnight", price: 999.99, stock: 5 },
            { color: "Starlight", price: 999.99, stock: 3 },
          ],
          isOnSale: false,
        },
        {
          id: 3,
          title: "iPhone 16",
          price: 199847.99,
          description: "Apple IPhone 16 - 8GB-256GB - 5G - Black",
          stock: 5,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/02/4867973/1.jpg?9144",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/02/4867973/2.jpg?9144",
          ],
          rating: 4.7,
          category: "Electronics",
          tags: ["apple", "iphone"],
          variants: [
            { color: "Black", price: 199756.99, stock: 3 },
            { color: "Silver", price: 219479.99, stock: 2 },
          ],
          isOnSale: true,
          discount: 10,
        },
        {
          id: 4,
          title: "Smart Home Hub",
          price: 249.99,
          description: "Control your smart home devices from one place",
          stock: 12,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/03/1709514/1.jpg?4085",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/03/1709514/2.jpg?4085",
          ],
          rating: 4.3,
          category: "Home",
          tags: ["smart", "home automation"],
          variants: [
            { color: "White", price: 249.99, stock: 8 },
            { color: "Black", price: 249.99, stock: 4 },
          ],
          isOnSale: true,
          discount: 20,
        },
        {
          id: 5,
          title: "Solar Standing Fan",
          price: 149.99,
          description: "Energy efficient standing fan with solar panel",
          stock: 7,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/05/2925104/1.jpg?0585",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/05/2925104/2.jpg?0585",
          ],
          rating: 4.2,
          category: "Home",
          tags: ["fan", "solar"],
          variants: [
            { color: "Black", price: 149.99, stock: 4 },
            { color: "Silver", price: 159.99, stock: 3 },
          ],
          isOnSale: false,
        },
        {
          id: 6,
          title: "Bluetooth Home Theater",
          price: 299.99,
          description: "Super X Bass 3 In 1 Bluetooth Home Theater",
          stock: 9,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/87/6595283/1.jpg?1639",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/87/6595283/2.jpg?1639",
          ],
          rating: 4.6,
          category: "Electronics",
          tags: ["audio", "speaker"],
          variants: [
            { color: "Black", price: 299.99, stock: 6 },
            { color: "Red", price: 309.99, stock: 3 },
          ],
          isOnSale: true,
          discount: 25,
        },
        {
          id: 7,
          title: "Eiffel Tower Decor",
          price: 89.99,
          description: "Paris Eiffel Metallic Tower Home Decor",
          stock: 15,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/86/2585672/1.jpg?0233",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/86/2585672/2.jpg?0233",
          ],
          rating: 4.4,
          category: "Home",
          tags: ["decor", "paris"],
          variants: [
            { color: "Gold", price: 89.99, stock: 10 },
            { color: "Silver", price: 89.99, stock: 5 },
          ],
          isOnSale: false,
        },
        {
          id: 8,
          title: "Abstract Face Statue",
          price: 129.99,
          description: "Abstract Face Statue Sculptures for Home Decor",
          stock: 4,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/56/9593193/2.jpg?3629",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/56/9593193/1.jpg?3629",
          ],
          rating: 4.1,
          category: "Home",
          tags: ["art", "sculpture"],
          variants: [
            { color: "Bronze", price: 129.99, stock: 2 },
            { color: "White", price: 129.99, stock: 2 },
          ],
          isOnSale: true,
          discount: 15,
        },
        {
          id: 9,
          title: "Hooded T-Shirt Pack",
          price: 39.99,
          description: "Pack Of 3 Plain Sleeveless Hooded T Shirts",
          stock: 20,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/67/1273013/1.jpg?3608",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/67/1273013/2.jpg?3608",
          ],
          rating: 4.0,
          category: "Clothing",
          tags: ["tshirt", "casual"],
          variants: [
            { color: "Black", price: 39.99, stock: 8 },
            { color: "White", price: 39.99, stock: 7 },
            { color: "Gray", price: 39.99, stock: 5 },
          ],
          isOnSale: true,
          discount: 30,
        },
        {
          id: 10,
          title: "Wireless Earbuds Pro",
          price: 159.99,
          description: "Premium wireless earbuds with active noise cancellation",
          stock: 12,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/2.jpg?1108",
          ],
          rating: 4.5,
          category: "Electronics",
          tags: ["earbuds", "audio"],
          variants: [
            { color: "Black", price: 159.99, stock: 8 },
            { color: "White", price: 159.99, stock: 4 },
          ],
          isOnSale: false,
        },
        {
          id: 11,
          title: "Fitness Smartwatch",
          price: 179.99,
          description: "Track your workouts and health metrics",
          stock: 6,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/2.jpg?1108",
          ],
          rating: 4.3,
          category: "Electronics",
          tags: ["fitness", "wearable"],
          variants: [
            { color: "Black", price: 179.99, stock: 3 },
            { color: "Pink", price: 179.99, stock: 3 },
          ],
          isOnSale: true,
          discount: 20,
        },
        {
          id: 12,
          title: "Gaming Keyboard",
          price: 89.99,
          description: "Mechanical gaming keyboard with RGB lighting",
          stock: 10,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108",
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/2.jpg?1108",
          ],
          rating: 4.7,
          category: "Electronics",
          tags: ["gaming", "keyboard"],
          variants: [
            { color: "Black", price: 89.99, stock: 6 },
            { color: "White", price: 89.99, stock: 4 },
          ],
          isOnSale: false,
        },
      ]);
      setSellers([
        { id: 1, name: "TechGadgets", rating: 4.8, products: [1, 2] },
        { id: 2, name: "HomeDecorPlus", rating: 4.6, products: [4, 7, 8] },
        { id: 3, name: "FashionHub", rating: 4.2, products: [9] },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Product listing functions
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...imagePreviews],
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...newProduct.variants];
    updatedVariants[index][field] = value;
    setNewProduct({ ...newProduct, variants: updatedVariants });
  };

  const addVariant = () => {
    setNewProduct({
      ...newProduct,
      variants: [
        ...newProduct.variants,
        {
          type: "",
          value: "",
          price: newProduct.price,
          stock: newProduct.stock,
        },
      ],
    });
  };

  const publishProduct = () => {
    // Convert image objects to URLs
    const imageUrls = newProduct.images.map((img) => img.preview);

    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      rating: 0,
      createdAt: new Date().toISOString(),
      images: imageUrls, // Use the URLs instead of file objects
    };

    setProducts([...products, productToAdd]);

    // Clean up object URLs
    newProduct.images.forEach((img) => {
      URL.revokeObjectURL(img.preview);
    });

    setNewProduct({
      title: "",
      price: "",
      description: "",
      stock: 0,
      images: [],
      videos: [],
      variants: [],
      category: "",
      tags: [],
      isPublished: false,
      isDigital: false,
    });
    setActiveTab("products");
  };

  // Cart functions
  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    
    // Animation feedback
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
      cartButton.classList.add('animate-ping');
      setTimeout(() => {
        cartButton.classList.remove('animate-ping');
      }, 500);
    }
  };

  const updateQuantity = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCart(updatedCart);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const checkout = () => {
    const newOrder = {
      id: orders.length + 1,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: "processing",
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    setActiveTab("orders");
  };

  // Wishlist functions
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Quick view functions
  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setCurrentSlide(0);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    document.body.style.overflow = 'auto';
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === quickViewProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? quickViewProduct.images.length - 1 : prev - 1
    );
  };

  // Search and filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesCategory =
      !filters.category || product.category === filters.category;
    const matchesRating = product.rating >= filters.rating;
    const matchesStock = !filters.inStock || product.stock > 0;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesCategory &&
      matchesRating &&
      matchesStock
    );
  });

  // Categories for filter
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);

  // Render functions
  const renderProducts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <motion.div
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <div className="relative">
            {product.isOnSale && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                {product.discount}% OFF
              </div>
            )}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <button 
                  onClick={() => openQuickView(product)}
                  className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg transform hover:scale-110 transition-transform"
                >
                  <EyeIcon className="h-5 w-5 text-gray-800 dark:text-white" />
                </button>
              </div>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-2 left-2 p-2 rounded-full ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-500'} transition-colors`}
            >
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg dark:text-white">{product.title}</h3>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                <span className="ml-1 dark:text-gray-300">{product.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {product.description.substring(0, 60)}...
            </p>
            <div className="mt-3 flex justify-between items-center">
              <div>
                {product.isOnSale ? (
                  <>
                    <span className="text-red-500 dark:text-red-400 font-bold">
                      $
                      {(product.price * (1 - product.discount / 100)).toFixed(
                        2
                      )}
                    </span>
                    <span className="ml-2 text-gray-400 dark:text-gray-500 line-through text-sm">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="font-bold dark:text-white">${product.price}</span>
                )}
              </div>
              <motion.button
                onClick={() => addToCart(product)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <div className="mt-2 text-xs text-orange-500 dark:text-orange-400">
                Only {product.stock} left!
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCart = () => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4 dark:text-white">Your Cart ({cart.length})</h2>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Your cart is empty</p>
          <motion.button
            onClick={() => setActiveTab("products")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping
          </motion.button>
        </div>
      ) : (
        <>
          <div className="divide-y dark:divide-gray-700">
            {cart.map((item, index) => (
              <motion.div 
                key={index} 
                className="py-4 flex"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">${item.price}</p>
                  <div className="mt-2 flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(index, parseInt(e.target.value))
                      }
                      className="w-16 px-2 py-1 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded"
                    />
                    <motion.button
                      onClick={() => removeFromCart(index)}
                      className="ml-4 text-red-500 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <div className="flex justify-between font-bold text-lg dark:text-white">
              <span>Total:</span>
              <span>
                $
                {cart
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
            <motion.button
              onClick={checkout}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );

  const renderProductForm = () => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4 dark:text-white">List a New Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Images
          </label>
          <div className="mt-1 flex items-center">
            <motion.button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PhotographIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
              Upload Images
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              multiple
              accept="image/*"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {newProduct.images.map((img, index) => (
              <motion.div 
                key={index} 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={img.preview}
                  alt=""
                  className="h-20 w-20 object-cover rounded"
                />
                <motion.button
                  onClick={() => {
                    const updatedImages = [...newProduct.images];
                    updatedImages.splice(index, 1);
                    setNewProduct({ ...newProduct, images: updatedImages });
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XIcon className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Variants
          </label>
          {newProduct.variants.map((variant, index) => (
            <motion.div 
              key={index} 
              className="grid grid-cols-3 gap-3 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Variant type (e.g. Color)"
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={variant.type}
                onChange={(e) =>
                  handleVariantChange(index, "type", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Variant value (e.g. Red)"
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={variant.value}
                onChange={(e) =>
                  handleVariantChange(index, "value", e.target.value)
                }
              />
              <div className="flex">
                <input
                  type="number"
                  placeholder="Price"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                />
                <motion.button
                  onClick={() => {
                    const updatedVariants = [...newProduct.variants];
                    updatedVariants.splice(index, 1);
                    setNewProduct({ ...newProduct, variants: updatedVariants });
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          <motion.button
            onClick={addVariant}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Variant
          </motion.button>
        </div>
        <div className="md:col-span-2 flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDigital"
              checked={newProduct.isDigital}
              onChange={(e) =>
                setNewProduct({ ...newProduct, isDigital: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="isDigital"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Digital Product
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={newProduct.isPublished}
              onChange={(e) =>
                setNewProduct({ ...newProduct, isPublished: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Publish Immediately
            </label>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <motion.button
          onClick={() => setActiveTab("products")}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={publishProduct}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Publish Product
        </motion.button>
      </div>
    </motion.div>
  );

  const renderSellerDashboard = () => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-6 dark:text-white">Seller Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Products</h3>
          <p className="text-2xl font-bold mt-1 dark:text-white">12</p>
        </motion.div>
        <motion.div 
          className="bg-green-50 dark:bg-green-900 p-4 rounded-lg"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Monthly Sales</h3>
          <p className="text-2xl font-bold mt-1 dark:text-white">$3,245</p>
        </motion.div>
        <motion.div 
          className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
            Average Rating
          </h3>
          <div className="flex items-center mt-1">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold ml-1 dark:text-white">4.7</span>
          </div>
        </motion.div>
      </div>

      <h3 className="font-semibold mb-3 dark:text-white">Your Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products.slice(0, 3).map((product) => (
              <motion.tr 
                key={product.id}
                whileHover={{ backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 1)' }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={product.images[0]}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Published
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-3 dark:text-white">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No recent orders</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div 
                key={order.id} 
                className="border dark:border-gray-700 rounded-lg p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Order #{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-6 dark:text-white">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <TruckIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            You haven't placed any orders yet
          </p>
          <motion.button
            onClick={() => setActiveTab("products")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
              key={order.id} 
              className="border dark:border-gray-700 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium dark:text-white">Order #{order.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex mb-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <p className="font-medium dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                <button className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  View Details
                </button>
                <p className="font-bold dark:text-white">Total: ${order.total.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderQuickView = () => (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                onClick={closeQuickView}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <XIcon className="h-5 w-5 text-gray-800 dark:text-white" />
              </button>
              
              <div className="relative h-64 md:h-96 w-full overflow-hidden">
                {quickViewProduct.images.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img}
                    alt={quickViewProduct.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 z-10"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-800 dark:text-white" />
                </button>
                
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 z-10"
                >
                  <ArrowRightIcon className="h-5 w-5 text-gray-800 dark:text-white" />
                </button>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                  {quickViewProduct.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold dark:text-white">{quickViewProduct.title}</h2>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(quickViewProduct.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {quickViewProduct.rating} ({quickViewProduct.reviews || 0} reviews)
                  </span>
                </div>
                
                <div className="mt-4">
                  {quickViewProduct.isOnSale ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-red-500 dark:text-red-400">
                        ${(quickViewProduct.price * (1 - quickViewProduct.discount / 100)).toFixed(2)}
                      </span>
                      <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${quickViewProduct.price}
                      </span>
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Save {quickViewProduct.discount}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold dark:text-white">${quickViewProduct.price}</span>
                  )}
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-300">{quickViewProduct.description}</p>
                </div>
                
                {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Variants</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickViewProduct.variants.map((variant, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 border rounded-full text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {variant.value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  {quickViewProduct.stock > 0 ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border dark:border-gray-600 rounded">
                        <button className="px-3 py-1 text-lg">-</button>
                        <span className="px-3 py-1">1</span>
                        <button className="px-3 py-1 text-lg">+</button>
                      </div>
                      <motion.button
                        onClick={() => {
                          addToCart(quickViewProduct);
                          closeQuickView();
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-red-500 dark:text-red-400">Out of Stock</div>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Category</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {quickViewProduct.category}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Availability</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {quickViewProduct.stock > 0 ? 
                          `${quickViewProduct.stock} available` : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.h1 
            className="text-xl font-bold text-gray-900 dark:text-white"
            whileHover={{ scale: 1.05 }}
          >
            Marketplace
          </motion.h1>

          {/* Search Bar */}
          <div className="relative w-1/3 mx-4 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab("cart")}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cart-button"
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              {cart.length > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {cart.length}
                </motion.span>
              )}
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      {isMobile && (
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-8">
            <motion.button
              onClick={() => setActiveTab("products")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Products
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("cart")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "cart"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cart ({cart.length})
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("sell")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sell"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sell
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("dashboard")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Seller Dashboard
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("orders")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              My Orders
            </motion.button>
          </nav>
        </div>

        {/* Filters */}
        {activeTab === "products" && (
          <>
            {isMobile ? (
              <div className="mb-4">
                <motion.button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow w-full justify-between"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium dark:text-white">Filters</span>
                  <div className="flex items-center">
                    <FilterIcon className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <ChevronDownIcon className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {showMobileFilters && (
                    <motion.div 
                      className="mt-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price range
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              placeholder="Min"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={filters.priceRange[0]}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  priceRange: [
                                    parseInt(e.target.value),
                                    filters.priceRange[1],
                                  ],
                                })
                              }
                            />
                            <span className="text-gray-500 dark:text-gray-400">to</span>
                            <input
                              type="number"
                              placeholder="Max"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={filters.priceRange[1]}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  priceRange: [
                                    filters.priceRange[0],
                                    parseInt(e.target.value),
                                  ],
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.category}
                            onChange={(e) =>
                              setFilters({ ...filters, category: e.target.value })
                            }
                          >
                            <option value="">All categories</option>
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Minimum rating
                          </label>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setFilters({ ...filters, rating: star })}
                                className={`${
                                  star <= filters.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              >
                                <StarIcon className="h-5 w-5" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.inStock}
                              onChange={(e) =>
                                setFilters({ ...filters, inStock: e.target.checked })
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              In stock only
                            </span>
                          </label>
                        </div>
                        <div className="flex justify-between pt-2">
                          <motion.button
                            onClick={() => setFilters({
                              priceRange: [0, 1000],
                              category: "",
                              rating: 0,
                              inStock: false,
                            })}
                            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            whileTap={{ scale: 0.95 }}
                          >
                            Reset all
                          </motion.button>
                          <motion.button
                            onClick={() => setShowMobileFilters(false)}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                            whileTap={{ scale: 0.95 }}
                          >
                            Apply
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium dark:text-white">Filters</h3>
                  <motion.button 
                    onClick={() => setFilters({
                      priceRange: [0, 1000],
                      category: "",
                      rating: 0,
                      inStock: false,
                    })}
                    className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset all
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price range
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [
                              parseInt(e.target.value),
                              filters.priceRange[1],
                            ],
                          })
                        }
                      />
                      <span className="text-gray-500 dark:text-gray-400">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [
                              filters.priceRange[0],
                              parseInt(e.target.value),
                            ],
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                    >
                      <option value="">All categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFilters({ ...filters, rating: star })}
                          className={`${
                            star <= filters.rating
                              ? "text-yellow-500"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          <StarIcon className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) =>
                          setFilters({ ...filters, inStock: e.target.checked })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        In stock only
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <>
            {activeTab === "products" && renderProducts()}
            {activeTab === "cart" && renderCart()}
            {activeTab === "sell" && renderProductForm()}
            {activeTab === "dashboard" && renderSellerDashboard()}
            {activeTab === "orders" && renderOrders()}
          </>
        )}
      </main>

      {/* Quick View Modal */}
      {renderQuickView()}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Marketplace
              </h3>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                The best place to buy and sell unique products.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Shop
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    All products
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    Trending
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    New arrivals
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Sell
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    Become a seller
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    Seller fees
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    Seller resources
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    Help Center
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    Privacy
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    whileHover={{ x: 5 }}
                  >
                    Terms
                  </motion.a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Socialvibe Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketplaceApp;