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
} from "@heroicons/react/outline";

const MarketplaceApp = () => {
  // App state
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
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

  // Refs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Mock data initialization
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // In your mock data initialization:
      setProducts([
        {
          id: 1,
          title: "Premium Wireless Headphones",
          price: 199.99,
          description: "Noise-cancelling wireless headphones with 30hr battery",
          stock: 15,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108",
          ], // Changed to a working image service
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
          id: 1,
          title: "Premium Wireless Headphones",
          price: 199.99,
          description: "Noise-cancelling wireless headphones with 30hr battery",
          stock: 1,
          images: [
            "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/10/9460283/1.jpg?4186",
          ], // Changed to a working image service
          rating: 5,
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
    id: 1,
    title: 'iphone i6',
    price: 199847.99,
    description: 'Apple IPhone 16 - 8GB-256GB - 5G - Black',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/02/4867973/1.jpg?9144'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199756.99, stock: 10 },
      { color: 'Silver', price: 219479.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/03/1709514/1.jpg?4085'], // Changed to a working image service
    rating: 4.5,
    category: 'Home',
    tags: ['home', 'inverter'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'standing fan',
    price: 199.99,
    description: ' standing fan with solar pannel',
    stock: 2,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/05/2925104/1.jpg?0585'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'home theater',
    price: 199.99,
    description: 'Super X Bass 3 In 1 Bluetooth Home Theater',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/87/6595283/1.jpg?1639'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'home decor',
    price: 1989.99,
    description: 'Paris Eiffel Metallic Tower Home Decor Interior Home Design',
    stock: 1,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/86/2585672/1.jpg?0233'], // Changed to a working image service
    rating: 4.5,
    category: 'Home',
    tags: ['home', 'Eiffel tower'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'abstract face home decor',
    price: 199.99,
    description: 'Abstract Face Statue Sculptures And Figurines Decoration Nodic Home Decor Luxury Living Room Decoration Figurines For Interior',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/56/9593193/2.jpg?3629'], // Changed to a working image service
    rating: 4.5,
    category: 'Home',
    tags: ['home', 'abstract'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'shirts',
    price: 199.99,
    description: 'Share this productPay on Delivery Danami Pack Of 3 Plain Sleeveless Hooded T Shirt Black White and  Ash',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/67/1273013/1.jpg?3608'], // Changed to a working image service
    rating: 4.5,
    category: 'Clothing',
    tags: ['cloth', ''],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'Noise-cancelling wireless headphones with 30hr battery',
    stock: 15,
    images: ['https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/1917773/1.jpg?1108'], // Changed to a working image service
    rating: 4.5,
    category: 'Electronics',
    tags: ['audio', 'wireless'],
    variants: [
      { color: 'Black', price: 199.99, stock: 10 },
      { color: 'Silver', price: 219.99, stock: 5 }
    ],
    isOnSale: true,
    discount: 15
  },

        // More products...
      ]);
      setSellers([
        { id: 1, name: "TechGadgets", rating: 4.8, products: [1, 2] },
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

  // Render functions
  const renderProducts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          {product.isOnSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200";
            }}
          />
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{product.title}</h3>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                <span className="ml-1">{product.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {product.description.substring(0, 60)}...
            </p>
            <div className="mt-3 flex justify-between items-center">
              <div>
                {product.isOnSale ? (
                  <>
                    <span className="text-red-500 font-bold">
                      $
                      {(product.price * (1 - product.discount / 100)).toFixed(
                        2
                      )}
                    </span>
                    <span className="ml-2 text-gray-400 line-through text-sm">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">${product.price}</span>
                )}
              </div>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Add to Cart
              </button>
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <div className="mt-2 text-xs text-orange-500">
                Only {product.stock} left!
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCart = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart ({cart.length})</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="divide-y">
            {cart.map((item, index) => (
              <div key={index} className="py-4 flex">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-600 text-sm">${item.price}</p>
                  <div className="mt-2 flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(index, parseInt(e.target.value))
                      }
                      className="w-16 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => removeFromCart(index)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>
                $
                {cart
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
            <button
              onClick={checkout}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderProductForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">List a New Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images
          </label>
          <div className="mt-1 flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PhotographIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
              Upload Images
            </button>
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
              <div key={index} className="relative">
                <img
                  src={img.preview}
                  alt=""
                  className="h-20 w-20 object-cover rounded"
                />
                <button
                  onClick={() => {
                    const updatedImages = [...newProduct.images];
                    updatedImages.splice(index, 1);
                    setNewProduct({ ...newProduct, images: updatedImages });
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Variants
          </label>
          {newProduct.variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="Variant type (e.g. Color)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={variant.type}
                onChange={(e) =>
                  handleVariantChange(index, "type", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Variant value (e.g. Red)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={variant.value}
                onChange={(e) =>
                  handleVariantChange(index, "value", e.target.value)
                }
              />
              <div className="flex">
                <input
                  type="number"
                  placeholder="Price"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                />
                <button
                  onClick={() => {
                    const updatedVariants = [...newProduct.variants];
                    updatedVariants.splice(index, 1);
                    setNewProduct({ ...newProduct, variants: updatedVariants });
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addVariant}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
          >
            + Add Variant
          </button>
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isDigital"
              className="ml-2 block text-sm text-gray-700"
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 block text-sm text-gray-700"
            >
              Publish Immediately
            </label>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setActiveTab("products")}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          onClick={publishProduct}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Publish Product
        </button>
      </div>
    </div>
  );

  const renderSellerDashboard = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Seller Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Products</h3>
          <p className="text-2xl font-bold mt-1">12</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Monthly Sales</h3>
          <p className="text-2xl font-bold mt-1">$3,245</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">
            Average Rating
          </h3>
          <div className="flex items-center mt-1">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold ml-1">4.7</span>
          </div>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Your Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.slice(0, 3).map((product) => (
              <tr key={product.id}>
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
                      <div className="text-sm font-medium text-gray-900">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Published
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-3">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No recent orders</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            You haven't placed any orders yet
          </p>
          <button
            onClick={() => setActiveTab("products")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex mb-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <button className="text-sm text-blue-500 hover:text-blue-700">
                  View Details
                </button>
                <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Marketplace</h1>

          {/* Search Bar */}
          <div className="relative w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="flex items-center space-x-1">
              <UserIcon className="h-6 w-6 text-gray-600" />
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "cart"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Cart ({cart.length})
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sell"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Sell
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Seller Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Orders
            </button>
          </nav>
        </div>

        {/* Filters */}
        {activeTab === "products" && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <button className="text-sm text-blue-500">Reset all</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="">All categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          : "text-gray-300"
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    In stock only
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Marketplace
              </h3>
              <p className="mt-4 text-sm text-gray-500">
                The best place to buy and sell unique products.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Shop
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    All products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Trending
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    New arrivals
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Sell
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Become a seller
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Seller fees
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Seller resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Socialvibe Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketplaceApp;
