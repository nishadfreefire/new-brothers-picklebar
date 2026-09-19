import React, { useState, useEffect } from 'react';
import { 
  X, Lock, ShieldCheck, LayoutDashboard, Package, ShoppingCart, 
  Tag, Settings, Plus, Edit2, Trash2, Check, RefreshCw, AlertTriangle, 
  TrendingUp, DollarSign, Eye, Search, Filter, Truck, Printer,
  Star, ArrowLeft, LogOut, Youtube, MessageCircle, Copy, ExternalLink,
  Layers, Flame, SlidersHorizontal, CheckCircle, Clock, PackageCheck,
  Send, Phone, MapPin, Mail, AlertCircle
} from 'lucide-react';
import { extractYouTubeId } from '../utils/youtube';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant, Order, OrderStatus, Category, TasteProfile, Coupon, StoreSettings } from '../types';
import { navigateTo } from '../utils/router';

// Curated high quality pickle product image presets for 1-click admin assignment
const PICKLE_IMAGE_PRESETS = [
  { label: '🥭 Mango Pickle', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { label: '🧄 Garlic Pickle', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
  { label: '🍒 Boroi Pickle (Plum)', url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80' },
  { label: '🥩 Beef Pickle (Meat)', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { label: '🫒 Olive Pickle (Jolpai)', url: 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&w=800&q=80' },
  { label: '🪵 Tamarind Pickle (Tetul)', url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80' },
  { label: '🌶️ Naga Chili Pickle', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80' },
  { label: '🥗 Mixed / Chalta Pickle', url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80' },
];

const WEIGHT_PRESETS = ['200g', '250g', '350g', '400g', '500g', '800g', '1kg', '2kg'];

const ALL_TASTE_PROFILES: TasteProfile[] = [
  'Tok-Jhal-Mishti (Sweet-Sour-Spicy)',
  'Tok (Sour)',
  'Jhal (Spicy)',
  'Mishti (Sweet)',
  'Mustard Pungent',
  'Garlic Infused',
  'Naga Hot'
];

export const AdminDashboard: React.FC<{ isStandalonePage?: boolean }> = ({ isStandalonePage = false }) => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    resetProducts,
    updateOrderStatus,
    deleteOrder,
    settings,
    updateSettings,
    coupons,
    addCoupon,
    refreshData
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Dashboard Navigation Tab
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'overview' | 'coupons' | 'reviews' | 'settings'>('products');

  // Stats & Data
  const [stats, setStats] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  
  // Orders Controls
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // Products Controls
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStockFilter, setProductStockFilter] = useState<string>('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [customGramInput, setCustomGramInput] = useState('');

  // Coupon Adding State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    description: ''
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<Partial<StoreSettings>>({});

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch Admin Stats, Orders & Reviews
  const fetchAdminData = async () => {
    try {
      const [statsRes, ordersRes, reviewsRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json())
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setAllOrders(ordersRes.orders);
      if (reviewsRes.success) setReviewsList(reviewsRes.reviews);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  useEffect(() => {
    if ((isStandalonePage || isAdminOpen) && isAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminOpen, isAuthenticated, isStandalonePage]);

  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  if (!isStandalonePage && !isAdminOpen) return null;

  // Handle PIN verification
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPinInput('');
        fetchAdminData();
      } else {
        setPinError('Invalid Admin PIN. (Default is 1234)');
      }
    } catch {
      setPinError('Server connection error. Please try again.');
    }
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      banglaName: '',
      category: 'mango',
      tagline: '',
      banglaTagline: '',
      description: '',
      banglaDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      tasteProfiles: ['Tok-Jhal-Mishti (Sweet-Sour-Spicy)'],
      spiceLevel: 3,
      price: 260,
      originalPrice: 320,
      variants: [
        { size: '250g', price: 260, originalPrice: 320, stock: 50 },
        { size: '500g', price: 480, originalPrice: 580, stock: 30 },
        { size: '1kg', price: 900, originalPrice: 1100, stock: 15 }
      ],
      defaultVariantIndex: 0,
      ingredients: ['Raw Fruits', 'Cold-Pressed Mustard Oil', 'Panch Phoron', 'Dry Red Chili', 'Himalayan Salt'],
      shelfLife: '12 Months',
      stock: 95,
      pairings: ['Khichuri', 'Rice & Dal', 'Paratha', 'Snacks'],
      benefits: ['100% Pure Mustard Oil', 'Zero Artificial Preservatives'],
      isBestSeller: false,
      isFeatured: true,
      isNew: true,
      isOrganic100: true
    });
    setCustomGramInput('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      ...prod,
      variants: prod.variants && prod.variants.length > 0 
        ? [...prod.variants] 
        : [{ size: '250g', price: prod.price, originalPrice: prod.originalPrice, stock: prod.stock || 50 }],
      defaultVariantIndex: prod.defaultVariantIndex ?? 0
    });
    setCustomGramInput('');
    setIsProductModalOpen(true);
  };

  // Add a gram weight variant to current product form
  const handleAddVariantSize = (sizeToAdd: string) => {
    if (!sizeToAdd.trim()) return;
    const currentVariants = productForm.variants ? [...productForm.variants] : [];
    
    // Check if already exists
    if (currentVariants.some(v => v.size.toLowerCase() === sizeToAdd.trim().toLowerCase())) {
      showToast(`Size '${sizeToAdd}' is already in the variant list!`);
      return;
    }

    // Default estimate pricing based on existing variants or base price
    let estimatedPrice = productForm.price || 300;
    if (sizeToAdd.includes('500g')) estimatedPrice = Math.round((productForm.price || 260) * 1.85);
    else if (sizeToAdd.includes('1kg') || sizeToAdd.includes('1000g')) estimatedPrice = Math.round((productForm.price || 260) * 3.5);
    else if (sizeToAdd.includes('400g')) estimatedPrice = Math.round((productForm.price || 260) * 1.5);
    else if (sizeToAdd.includes('2kg')) estimatedPrice = Math.round((productForm.price || 260) * 6.8);

    const newVariant: ProductVariant = {
      size: sizeToAdd.trim(),
      price: estimatedPrice,
      originalPrice: Math.round(estimatedPrice * 1.2),
      stock: 30
    };

    const updatedVariants = [...currentVariants, newVariant];
    setProductForm({
      ...productForm,
      variants: updatedVariants,
      price: updatedVariants[0]?.price || estimatedPrice,
      stock: updatedVariants.reduce((sum, v) => sum + (v.stock || 0), 0)
    });
    setCustomGramInput('');
  };

  // Remove a variant from product form
  const handleRemoveVariant = (indexToRemove: number) => {
    const currentVariants = productForm.variants ? [...productForm.variants] : [];
    if (currentVariants.length <= 1) {
      showToast('Product must have at least 1 size/weight variant!');
      return;
    }
    const updated = currentVariants.filter((_, idx) => idx !== indexToRemove);
    let newDefaultIdx = productForm.defaultVariantIndex ?? 0;
    if (newDefaultIdx >= updated.length) newDefaultIdx = 0;

    setProductForm({
      ...productForm,
      variants: updated,
      defaultVariantIndex: newDefaultIdx,
      price: updated[newDefaultIdx]?.price || updated[0]?.price || productForm.price,
      stock: updated.reduce((sum, v) => sum + (v.stock || 0), 0)
    });
  };

  // Update a single variant field
  const handleUpdateVariantField = (idx: number, field: keyof ProductVariant, value: any) => {
    const currentVariants = productForm.variants ? [...productForm.variants] : [];
    if (!currentVariants[idx]) return;

    currentVariants[idx] = {
      ...currentVariants[idx],
      [field]: field === 'price' || field === 'originalPrice' || field === 'stock' ? Number(value) : value
    };

    const totalStock = currentVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const defaultIdx = productForm.defaultVariantIndex ?? 0;
    const basePrice = currentVariants[defaultIdx]?.price || currentVariants[0]?.price || productForm.price;

    setProductForm({
      ...productForm,
      variants: currentVariants,
      price: basePrice,
      stock: totalStock
    });
  };

  // Quick In-line Stock Adjustment (+5, -1) directly from product list
  const handleQuickStockChange = async (prod: Product, delta: number) => {
    const newStock = Math.max(0, (prod.stock || 0) + delta);
    const updatedVariants = prod.variants ? prod.variants.map((v, i) => i === 0 ? { ...v, stock: Math.max(0, v.stock + delta) } : v) : [];
    const updatedProd = { ...prod, stock: newStock, variants: updatedVariants };
    await updateProduct(updatedProd);
    showToast(`Stock updated for ${prod.name} (${newStock} jars)`);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.banglaName) {
      alert('Please provide both English and Bengali product names.');
      return;
    }

    const variants = productForm.variants && productForm.variants.length > 0 
      ? productForm.variants 
      : [{ size: '250g', price: Number(productForm.price) || 260, stock: Number(productForm.stock) || 50 }];

    const defaultIdx = productForm.defaultVariantIndex ?? 0;
    const finalPrice = variants[defaultIdx]?.price || variants[0]?.price || Number(productForm.price) || 260;
    const finalOriginalPrice = variants[defaultIdx]?.originalPrice || variants[0]?.originalPrice || productForm.originalPrice;
    const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

    const payload: Product = {
      id: editingProduct ? editingProduct.id : `nbp-${Date.now().toString().slice(-4)}`,
      name: productForm.name.trim(),
      banglaName: productForm.banglaName.trim(),
      category: (productForm.category as Category) || 'mango',
      tagline: productForm.tagline || '',
      banglaTagline: productForm.banglaTagline || '',
      description: productForm.description || '',
      banglaDescription: productForm.banglaDescription || '',
      imageUrl: productForm.imageUrl || PICKLE_IMAGE_PRESETS[0].url,
      tasteProfiles: productForm.tasteProfiles && productForm.tasteProfiles.length > 0 ? productForm.tasteProfiles : ['Tok-Jhal-Mishti (Sweet-Sour-Spicy)'],
      spiceLevel: productForm.spiceLevel || 3,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      variants: variants,
      defaultVariantIndex: defaultIdx,
      ingredients: typeof productForm.ingredients === 'string' 
        ? (productForm.ingredients as string).split(',').map(s => s.trim()) 
        : productForm.ingredients || ['Raw Fruits', 'Mustard Oil', 'Spices'],
      shelfLife: productForm.shelfLife || '12 Months',
      stock: totalStock,
      pairings: productForm.pairings || ['Khichuri', 'Rice', 'Paratha'],
      benefits: productForm.benefits || ['100% Pure Cold-Pressed Mustard Oil', 'Preservative Free'],
      isBestSeller: !!productForm.isBestSeller,
      isFeatured: productForm.isFeatured !== false,
      isNew: !!productForm.isNew,
      isOrganic100: productForm.isOrganic100 !== false,
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 12
    };

    if (editingProduct) {
      await updateProduct(payload);
      showToast('Product updated successfully!');
    } else {
      await addProduct(payload);
      showToast('New pickle product added to catalog!');
    }
    setIsProductModalOpen(false);
    fetchAdminData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this pickle product?')) {
      await deleteProduct(id);
      showToast('Product deleted from catalog.');
      fetchAdminData();
    }
  };

  const handleResetCatalog = async () => {
    if (confirm('Reset catalog to the default 15 handcrafted pickle products?')) {
      await resetProducts();
      showToast('Default 15 pickle products restored.');
      fetchAdminData();
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} status updated to: ${newStatus}`);
    fetchAdminData();
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm(`Permanently delete order #${orderId}?`)) {
      await deleteOrder(orderId);
      showToast(`Order #${orderId} has been deleted.`);
      fetchAdminData();
      if (selectedOrderForDetails?.id === orderId) {
        setSelectedOrderForDetails(null);
      }
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    showToast('Store settings and video links saved to database!');
  };

  // Save Coupon
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code || !newCouponForm.discountValue) return;

    await addCoupon({
      code: newCouponForm.code.toUpperCase().trim(),
      discountType: newCouponForm.discountType || 'percentage',
      discountValue: Number(newCouponForm.discountValue),
      minOrderAmount: Number(newCouponForm.minOrderAmount || 0),
      description: newCouponForm.description || ''
    });
    setIsCouponModalOpen(false);
    setNewCouponForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, description: '' });
    showToast(`Coupon ${newCouponForm.code} created successfully!`);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    if (productStockFilter === 'low' && (p.stock || 0) >= 30) return false;
    if (productStockFilter === 'out' && (p.stock || 0) > 0) return false;
    if (productStockFilter === 'in' && (p.stock || 0) === 0) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.banglaName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = allOrders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Helper for generating customer WhatsApp message
  const getWhatsAppMessageUrl = (order: Order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    const text = encodeURIComponent(
      `Hello ${order.customerName}! 🌶️ Greetings from New Brother Picklebar. Your order #${order.id} (৳${order.totalAmount}) is confirmed. Track status anytime: ${window.location.origin}`
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  };

  return (
    <div 
      className={isStandalonePage 
        ? "min-h-screen bg-[#F5F2EB] flex flex-col font-sans text-stone-900" 
        : "relative bg-[#F5F2EB] w-full max-w-7xl rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-4 flex flex-col h-[94vh] text-stone-900"}
      onClick={e => e.stopPropagation()}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-amber-300 px-4 py-2.5 rounded-2xl shadow-xl border border-amber-500/40 text-xs font-extrabold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="p-3.5 sm:px-6 bg-[#1C1917] text-white border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E07A24] to-[#C96818] text-white flex items-center justify-center font-extrabold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-wide font-serif text-amber-50">
                New Brother Picklebar • Admin Portal
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live DB Synced
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Manage products, weight variants, orders, discount coupons, reviews & store settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => navigateTo('/')}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
            title="Go to Customer Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={() => {
              fetchAdminData();
              refreshData();
              showToast('Refreshed latest data from server');
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}

          {!isStandalonePage && (
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Authentication Gate */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#F5F2EB]">
          <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 bg-orange-50 text-[#E07A24] border border-orange-200 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-900 font-serif">Admin Security Access</h3>
              <p className="text-xs text-stone-500">Enter the 4-digit security PIN to unlock the store management center.</p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="PIN: 1234"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-center text-xl font-mono font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-[#E07A24]"
                  autoFocus
                />
                {pinError && <p className="text-xs text-red-600 font-bold mt-1.5">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#E07A24] hover:bg-[#C96818] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Dashboard</span>
              </button>
            </form>

            <div className="text-[11px] text-stone-400 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Default Security PIN: <code className="bg-amber-100 px-1.5 py-0.5 rounded text-stone-800 font-bold">1234</code>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard Content */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F5F2EB]">
          
          {/* Left Navigation Tabs */}
          <div className="w-full md:w-60 bg-white border-r border-stone-200 p-2.5 sm:p-3 flex md:flex-col gap-1 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-[#E07A24] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Products & Sizes ({products.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer relative ${
                activeTab === 'orders' ? 'bg-[#E07A24] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Customer Orders ({allOrders.length})</span>
              </div>
              {allOrders.filter(o => o.status === 'pending').length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {allOrders.filter(o => o.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#E07A24] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Analytics & Sales</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'coupons' ? 'bg-[#E07A24] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Discount Coupons ({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'reviews' ? 'bg-[#E07A24] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Customer Reviews ({reviewsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#E07A24] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store & Video Settings</span>
            </button>
          </div>

          {/* Main Tab Panels */}
          <div className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
            
            {/* 1. PRODUCT CATALOG & VARIANT MANAGER */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                {/* Search & Actions Bar */}
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        placeholder="Search pickles by name or category..."
                        className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetCatalog}
                        className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Reset 15 starter pickle items"
                      >
                        Restore 15 Defaults
                      </button>

                      <button
                        onClick={handleOpenAddProduct}
                        className="px-4 py-2 rounded-xl bg-[#E07A24] hover:bg-[#C96818] text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add New Pickle</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-100 text-xs">
                    <span className="text-[11px] font-bold text-stone-400 mr-1">Category:</span>
                    {[
                      { id: 'all', label: 'All Pickles' },
                      { id: 'mango', label: '🥭 Mango' },
                      { id: 'garlic', label: '🧄 Garlic' },
                      { id: 'boroi', label: '🍒 Boroi' },
                      { id: 'meat', label: '🥩 Beef' },
                      { id: 'olive', label: '🫒 Olive' },
                      { id: 'tamarind', label: '🪵 Tamarind' },
                      { id: 'seasonal', label: '🌶️ Seasonal' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setProductCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          productCategoryFilter === cat.id
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}

                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-[11px] font-bold text-stone-400">Stock:</span>
                      <select
                        value={productStockFilter}
                        onChange={e => setProductStockFilter(e.target.value)}
                        className="px-2 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs font-bold"
                      >
                        <option value="all">All Stock Status</option>
                        <option value="low">⚠️ Low Stock (&lt; 30)</option>
                        <option value="out">❌ Out of Stock (0)</option>
                        <option value="in">✅ In Stock</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                  {filteredProducts.map(prod => (
                    <div 
                      key={prod.id} 
                      className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Image & Main Info */}
                        <div className="flex gap-3">
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.name} 
                            className="w-18 h-18 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                                {prod.category}
                              </span>
                              {prod.isBestSeller && (
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-orange-100 text-[#C96818]">
                                  Best Seller
                                </span>
                              )}
                            </div>
                            <h4 className="font-black text-sm text-stone-900 truncate mt-0.5 font-serif">
                              {prod.name}
                            </h4>
                            <div className="text-[11px] text-stone-500 truncate">{prod.banglaName}</div>
                            <div className="text-xs font-black text-[#E07A24] mt-1 flex items-center gap-2">
                              <span>Base Price: ৳{prod.price}</span>
                              {prod.originalPrice && (
                                <span className="text-stone-400 line-through text-[11px]">৳{prod.originalPrice}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Gram Sizes / Variants List */}
                        <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5 text-[#E07A24]" />
                              <span>Weight Variants ({prod.variants?.length || 1}):</span>
                            </span>
                            <span className={prod.stock < 25 ? 'text-red-600 font-extrabold' : 'text-emerald-700 font-bold'}>
                              Total Stock: {prod.stock || 0}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {prod.variants && prod.variants.length > 0 ? (
                              prod.variants.map((v, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[11px] font-bold text-stone-800 shadow-2xs"
                                >
                                  <span className="text-[#C96818]">{v.size}:</span>
                                  <span>৳{v.price}</span>
                                  <span className="text-stone-400 text-[10px]">({v.stock} pcs)</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-stone-400">1 Default Variant</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Quick Stock & Actions */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        {/* Quick Stock Controls */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-stone-400 font-bold">Stock:</span>
                          <button
                            onClick={() => handleQuickStockChange(prod, -1)}
                            className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-black flex items-center justify-center cursor-pointer"
                            title="Decrease stock by 1 jar"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-xs text-stone-800 min-w-6 text-center">{prod.stock || 0}</span>
                          <button
                            onClick={() => handleQuickStockChange(prod, +5)}
                            className="px-1.5 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center cursor-pointer border border-emerald-200"
                            title="Add 5 jars to stock"
                          >
                            +5
                          </button>
                        </div>

                        {/* Edit / Delete */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-orange-50 text-[#C96818] border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. CUSTOMER ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      placeholder="Search by Order ID, Customer Name, Phone Number, City..."
                      className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'all', label: 'All Orders' },
                      { id: 'pending', label: '⏳ Pending' },
                      { id: 'confirmed', label: '✅ Confirmed' },
                      { id: 'packaging', label: '📦 Packaging' },
                      { id: 'out_for_delivery', label: '🚚 Out for Delivery' },
                      { id: 'delivered', label: '🎉 Delivered' },
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setOrderStatusFilter(st.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          orderStatusFilter === st.id
                            ? 'bg-[#E07A24] text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-800 font-extrabold uppercase">
                        <tr>
                          <th className="p-3.5">Order & Date</th>
                          <th className="p-3.5">Customer & Contact</th>
                          <th className="p-3.5">Items & Sizes</th>
                          <th className="p-3.5">Amount & Payment</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-stone-400 font-bold">
                              No customer orders found.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                              <td className="p-3.5">
                                <span className="font-extrabold text-stone-900 block font-mono">#{order.id}</span>
                                <span className="text-[10px] text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-stone-900 block">{order.customerName}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[11px] text-[#E07A24] font-bold font-mono">{order.phone}</span>
                                  <a
                                    href={getWhatsAppMessageUrl(order)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                                    title="Send WhatsApp Message"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </a>
                                </div>
                                <div className="text-[10px] text-stone-500 truncate max-w-[160px]">{order.address}, {order.city}</div>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-stone-800">{order.items.length} jar(s)</span>
                                <div className="text-[10px] text-stone-500 truncate max-w-[180px]">
                                  {order.items.map(i => `${i.productName} (${i.size})`).join(', ')}
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span className="font-black text-stone-900 text-sm block">৳{order.totalAmount}</span>
                                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {order.paymentMethod} • {order.paymentStatus}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <select
                                  value={order.status}
                                  onChange={e => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                                    order.status === 'delivered'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : order.status === 'out_for_delivery'
                                      ? 'bg-orange-50 text-orange-800 border-orange-300'
                                      : order.status === 'pending'
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : 'bg-stone-50 text-stone-700 border-stone-300'
                                  }`}
                                >
                                  <option value="pending">⏳ Pending</option>
                                  <option value="confirmed">✅ Confirmed</option>
                                  <option value="packaging">📦 Packaging</option>
                                  <option value="out_for_delivery">🚚 Out for Delivery</option>
                                  <option value="delivered">🎉 Delivered</option>
                                  <option value="cancelled">❌ Cancelled</option>
                                </select>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedOrderForDetails(order)}
                                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    Invoice
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. OVERVIEW & ANALYTICS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-stone-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                      <DollarSign className="w-4 h-4 text-[#E07A24]" />
                    </div>
                    <div className="text-2xl font-black text-stone-900 font-serif">৳{stats?.totalRevenue || 0}</div>
                    <div className="text-[11px] text-emerald-600 font-bold">Lifetime Sales Volume</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-stone-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                      <ShoppingCart className="w-4 h-4 text-[#E07A24]" />
                    </div>
                    <div className="text-2xl font-black text-stone-900 font-serif">{stats?.totalOrders || allOrders.length}</div>
                    <div className="text-[11px] text-stone-500">Processed by Store</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-stone-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Pending Delivery</span>
                      <Truck className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600 font-serif">{stats?.pendingOrders || 0}</div>
                    <div className="text-[11px] text-amber-700 font-bold">Needs Processing</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-stone-400">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
                      <Package className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-stone-900 font-serif">{products.length}</div>
                    <div className="text-[11px] text-emerald-700 font-bold">Active in Storefront</div>
                  </div>
                </div>

                {/* Popular Categories & Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                    <h4 className="font-extrabold text-sm text-stone-900 font-serif">Order Status Distribution</h4>
                    <div className="space-y-2.5 text-xs">
                      {[
                        { label: 'Pending Orders', count: allOrders.filter(o => o.status === 'pending').length, color: 'bg-amber-500' },
                        { label: 'Confirmed', count: allOrders.filter(o => o.status === 'confirmed').length, color: 'bg-blue-500' },
                        { label: 'Packaging', count: allOrders.filter(o => o.status === 'packaging').length, color: 'bg-indigo-500' },
                        { label: 'Out for Delivery', count: allOrders.filter(o => o.status === 'out_for_delivery').length, color: 'bg-orange-500' },
                        { label: 'Delivered', count: allOrders.filter(o => o.status === 'delivered').length, color: 'bg-emerald-500' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="font-medium text-stone-600">{item.label}</span>
                          <span className="font-extrabold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                            {item.count} orders
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                    <h4 className="font-extrabold text-sm text-stone-900 font-serif">Quick Summary</h4>
                    <div className="space-y-3 text-xs text-stone-600">
                      <p>✨ <strong>Storefront Status:</strong> Open for customer orders 24/7 across Bangladesh.</p>
                      <p>📦 <strong>Cash on Delivery (COD):</strong> Fully enabled with instant receipt generation.</p>
                      <p>📱 <strong>bKash & Nagad:</strong> Active with direct merchant numbers.</p>
                      <p>🚚 <strong>Delivery Coverage:</strong> Inside Dhaka (৳70), Sub-Dhaka (৳100), Nationwide (৳130).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900 font-serif">Discount Promo Codes</h3>
                    <p className="text-xs text-stone-500">Create promotional discount codes for your customers.</p>
                  </div>
                  <button
                    onClick={() => setIsCouponModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#E07A24] hover:bg-[#C96818] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ New Coupon</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {coupons.map(coupon => (
                    <div key={coupon.code} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-mono font-black text-sm rounded-lg border border-amber-300">
                          {coupon.code}
                        </span>
                        <span className="text-xs font-black text-emerald-600">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{coupon.description || 'Valid on all items'}</p>
                      <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                        Min. Order: ৳{coupon.minOrderAmount || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <h3 className="font-extrabold text-sm text-stone-900 font-serif">Customer Feedback & Reviews</h3>
                  <p className="text-xs text-stone-500">Live reviews received from genuine customers.</p>
                </div>

                <div className="space-y-3">
                  {reviewsList.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-400 font-bold text-xs">
                      No customer reviews submitted yet.
                    </div>
                  ) : (
                    reviewsList.map((rev, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">{rev.userName || rev.name || 'Anonymous Customer'}</span>
                            <span className="text-[10px] text-stone-400">{rev.location || 'Dhaka'}</span>
                          </div>
                          <div className="flex items-center text-amber-400 text-xs">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-stone-700 italic">"{rev.comment}"</p>
                        {rev.productName && (
                          <div className="text-[10px] text-[#E07A24] font-bold">
                            Product: {rev.productName}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. STORE & VIDEO SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-5 max-w-3xl">
                {/* YouTube Video Settings */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900 font-serif">YouTube Process & Craft Video</h4>
                      <p className="text-xs text-stone-500">Embedded on homepage & Craft story page for customer trust.</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">YouTube Video URL</label>
                      <input
                        type="url"
                        value={settingsForm.craftVideoUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, craftVideoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Video Title / Heading</label>
                      <input
                        type="text"
                        value={settingsForm.craftVideoTitle || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, craftVideoTitle: e.target.value })}
                        placeholder="Traditional Handcrafted Mustard Oil Pickle Making"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>

                    {settingsForm.craftVideoUrl && extractYouTubeId(settingsForm.craftVideoUrl) && (
                      <div className="pt-2">
                        <span className="font-bold text-stone-600 block mb-1 text-[11px]">Video Preview:</span>
                        <div className="aspect-video rounded-xl overflow-hidden border border-stone-200 max-w-md">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(settingsForm.craftVideoUrl)}`}
                            title="YouTube preview"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Charges & Thresholds */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#E07A24] flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900 font-serif">Delivery Charges & Thresholds</h4>
                      <p className="text-xs text-stone-500">Set shipping rates across Bangladesh.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Inside Dhaka City (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryFeeInsideDhaka || 70}
                        onChange={e => setSettingsForm({ ...settingsForm, deliveryFeeInsideDhaka: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Sub-Dhaka / Suburbs (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryFeeSubDhaka || 100}
                        onChange={e => setSettingsForm({ ...settingsForm, deliveryFeeSubDhaka: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Outside Dhaka / Nationwide (৳)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryFeeOutsideDhaka || 130}
                        onChange={e => setSettingsForm({ ...settingsForm, deliveryFeeOutsideDhaka: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>
                  </div>

                  <div className="text-xs pt-1">
                    <label className="font-bold text-stone-700 block mb-1">Free Delivery Minimum Order (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold || 1500}
                      onChange={e => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full max-w-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                    />
                  </div>
                </div>

                {/* Helpline & Payment Numbers */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900 font-serif">Helpline & Payment Numbers</h4>
                      <p className="text-xs text-stone-500">Contact information displayed across header and checkout.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Customer Helpline Phone</label>
                      <input
                        type="text"
                        value={settingsForm.contactPhone || '01711-234567'}
                        onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">bKash Merchant/Personal Number</label>
                      <input
                        type="text"
                        value={settingsForm.bkashNumber || '01711-234567'}
                        onChange={e => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#E07A24] hover:bg-[#C96818] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Save All Settings
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-3xl w-full max-w-3xl border border-stone-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:px-6 bg-[#1C1917] text-white flex items-center justify-between border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#E07A24]" />
                <div>
                  <h3 className="font-black text-sm sm:text-base font-serif text-white">
                    {editingProduct ? 'Edit Pickle Product' : 'Add New Pickle Product'}
                  </h3>
                  <p className="text-[11px] text-stone-400">Configure Bengali & English details, weight variants, pricing and images</p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* Product Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    English Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Raw Mango Special Pickle"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Bengali Name (বাংলা নাম) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.banglaName || ''}
                    onChange={e => setProductForm({ ...productForm, banglaName: e.target.value })}
                    placeholder="e.g. কাঁচা আমের স্পেশাল টক-ঝাল আচার"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                  />
                </div>
              </div>

              {/* Category & Spice Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Pickle Category</label>
                  <select
                    value={productForm.category || 'mango'}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value as Category })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                  >
                    <option value="mango">🥭 Mango (আমের আচার)</option>
                    <option value="garlic">🧄 Garlic (রসুনের আচার)</option>
                    <option value="boroi">🍒 Boroi (বরইয়ের আচার)</option>
                    <option value="meat">🥩 Beef (গরুর মাংসের আচার)</option>
                    <option value="olive">🫒 Olive (জলপাই আচার)</option>
                    <option value="tamarind">🪵 Tamarind (তেঁতুল আচার)</option>
                    <option value="seasonal">🌶️ Seasonal / Mixed (সিজনাল আচার)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Spice Level: {productForm.spiceLevel || 3}/5 ({'🌶️'.repeat(productForm.spiceLevel || 3)})
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={productForm.spiceLevel || 3}
                    onChange={e => setProductForm({ ...productForm, spiceLevel: Number(e.target.value) as any })}
                    className="w-full accent-[#E07A24]"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                    <span>1: Mild (হালকা)</span>
                    <span>3: Medium (মাঝারি)</span>
                    <span>5: Naga Hot (চরম ঝাল)</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Image Presets */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">1-Click High-Res Image Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {PICKLE_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, imageUrl: preset.url })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        productForm.imageUrl === preset.url
                          ? 'bg-[#E07A24] text-white border-[#C96818]'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="url"
                    value={productForm.imageUrl || ''}
                    onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="Or paste any custom image URL..."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                  />
                </div>
              </div>

              {/* WEIGHT & GRAM VARIANTS MANAGER */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                    <Layers className="w-4 h-4 text-[#E07A24]" />
                    <span>Weight & Gram Variants (সাইজ ও দাম)</span>
                  </div>
                  <span className="text-[11px] font-bold text-stone-500">
                    Total Jars: {productForm.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0}
                  </span>
                </div>

                {/* Quick Add Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-stone-500 font-bold">Quick Add:</span>
                  {WEIGHT_PRESETS.map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handleAddVariantSize(w)}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-orange-100 text-stone-800 border border-stone-300 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      + {w}
                    </button>
                  ))}
                </div>

                {/* Custom Size Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customGramInput}
                    onChange={e => setCustomGramInput(e.target.value)}
                    placeholder="Custom weight e.g. 350g, 750g..."
                    className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#E07A24]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddVariantSize(customGramInput)}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                  >
                    Add Size
                  </button>
                </div>

                {/* Variants Table */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-stone-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Size/Weight</th>
                        <th className="p-2.5">Price (৳)</th>
                        <th className="p-2.5">Original (৳)</th>
                        <th className="p-2.5">Stock (Jars)</th>
                        <th className="p-2.5 text-center">Default</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {productForm.variants?.map((v, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/30">
                          <td className="p-2 font-bold text-stone-900 font-mono">{v.size}</td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.price}
                              onChange={e => handleUpdateVariantField(idx, 'price', e.target.value)}
                              className="w-20 px-2 py-1 bg-stone-50 border border-stone-200 rounded-md font-bold text-stone-900"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.originalPrice || ''}
                              onChange={e => handleUpdateVariantField(idx, 'originalPrice', e.target.value)}
                              placeholder="Optional"
                              className="w-20 px-2 py-1 bg-stone-50 border border-stone-200 rounded-md text-stone-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.stock}
                              onChange={e => handleUpdateVariantField(idx, 'stock', e.target.value)}
                              className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-md font-bold"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="radio"
                              name="defaultVariant"
                              checked={productForm.defaultVariantIndex === idx}
                              onChange={() => setProductForm({ ...productForm, defaultVariantIndex: idx })}
                              className="accent-[#E07A24]"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                              title="Remove size"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Taglines & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">English Tagline</label>
                  <input
                    type="text"
                    value={productForm.tagline || ''}
                    onChange={e => setProductForm({ ...productForm, tagline: e.target.value })}
                    placeholder="e.g. Handcrafted with traditional sun-ripened spices"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Bengali Tagline (বাংলা ট্যাগলাইন)</label>
                  <input
                    type="text"
                    value={productForm.banglaTagline || ''}
                    onChange={e => setProductForm({ ...productForm, banglaTagline: e.target.value })}
                    placeholder="e.g. খাঁটি সরিষার তেলে জারিত সেরা স্বাদ"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Shelf Life & Ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Ingredients (Comma Separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(productForm.ingredients) ? productForm.ingredients.join(', ') : productForm.ingredients || ''}
                    onChange={e => setProductForm({ ...productForm, ingredients: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Raw Mango, Mustard Oil, Fenugreek, Chili, Salt"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Shelf Life (সংরক্ষণ কাল)</label>
                  <input
                    type="text"
                    value={productForm.shelfLife || '12 Months'}
                    onChange={e => setProductForm({ ...productForm, shelfLife: e.target.value })}
                    placeholder="e.g. 12 Months (১২ মাস)"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Badges & Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={!!productForm.isBestSeller}
                    onChange={e => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="accent-[#E07A24] w-4 h-4 rounded"
                  />
                  <span>Best Seller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured !== false}
                    onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-[#E07A24] w-4 h-4 rounded"
                  />
                  <span>Featured on Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={!!productForm.isNew}
                    onChange={e => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="accent-[#E07A24] w-4 h-4 rounded"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E07A24] hover:bg-[#C96818] text-white font-extrabold shadow-md transition-all cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-sm text-stone-900 font-serif">Create Discount Promo Code</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCouponForm.code || ''}
                  onChange={e => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ACHAR15"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Discount Type</label>
                  <select
                    value={newCouponForm.discountType}
                    onChange={e => setNewCouponForm({ ...newCouponForm, discountType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponForm.discountValue || ''}
                    onChange={e => setNewCouponForm({ ...newCouponForm, discountValue: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Minimum Order Amount (৳)</label>
                <input
                  type="number"
                  value={newCouponForm.minOrderAmount || 0}
                  onChange={e => setNewCouponForm({ ...newCouponForm, minOrderAmount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={newCouponForm.description || ''}
                  onChange={e => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                  placeholder="e.g. 15% discount on all orders above ৳600"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E07A24] text-white font-extrabold shadow-sm"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS & INVOICE MODAL */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-stone-200 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 font-serif">Invoice & Order Details</h3>
                <span className="font-mono text-xs text-[#E07A24] font-bold">#{selectedOrderForDetails.id}</span>
              </div>
              <button onClick={() => setSelectedOrderForDetails(null)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-stone-50 p-3.5 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-stone-900">{selectedOrderForDetails.customerName}</span>
                <span className="text-stone-400">{new Date(selectedOrderForDetails.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-stone-600 font-mono font-bold">{selectedOrderForDetails.phone}</div>
              <div className="text-stone-700">{selectedOrderForDetails.address}, {selectedOrderForDetails.city}</div>
              {selectedOrderForDetails.orderNotes && (
                <div className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-1 text-[11px]">
                  <strong>Notes:</strong> {selectedOrderForDetails.orderNotes}
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-stone-700 block">Purchased Jars:</span>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {selectedOrderForDetails.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs bg-white">
                    <div>
                      <span className="font-bold text-stone-900 block">{item.productName}</span>
                      <span className="text-stone-500 text-[11px]">{item.size} × {item.quantity}</span>
                    </div>
                    <span className="font-black text-stone-900">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl text-xs space-y-1.5 border border-stone-200">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-bold">৳{selectedOrderForDetails.subtotal || selectedOrderForDetails.totalAmount - (selectedOrderForDetails.deliveryFee || 70)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge:</span>
                <span className="font-bold">৳{selectedOrderForDetails.deliveryFee || 70}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-black text-sm pt-1 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-[#E07A24]">৳{selectedOrderForDetails.totalAmount}</span>
              </div>
              <div className="text-[11px] text-stone-500 font-bold uppercase pt-1">
                Payment: {selectedOrderForDetails.paymentMethod} ({selectedOrderForDetails.paymentStatus})
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <a
                href={getWhatsAppMessageUrl(selectedOrderForDetails)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
