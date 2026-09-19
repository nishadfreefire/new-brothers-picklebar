import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, CheckCircle2, Truck, CreditCard, Phone, MapPin, Tag, ArrowRight, MessageCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { DeliveryZone, PaymentMethod, Order } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshData';

// Accordion Coupon Section matching uploaded reference design
const CouponSection: React.FC = () => {
  const { appliedCoupon, applyCouponCode } = useStore();
  const [isOpen, setIsOpen] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleApply = async (codeToApply?: string) => {
    const targetCode = codeToApply || couponCode;
    if (!targetCode.trim()) return;

    const result = await applyCouponCode(targetCode.trim().toUpperCase());
    if (result.success) {
      setMsg(result.message || 'Coupon applied successfully!');
      setIsError(false);
      setCouponCode('');
    } else {
      setMsg(result.message || 'Invalid coupon code');
      setIsError(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-stone-50/50 transition-colors"
      >
        <span className="text-sm sm:text-base font-bold text-stone-800">
          Have any coupon or gift voucher?
        </span>
        <span className="text-[#E07A24]">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 space-y-3.5 border-t border-stone-100 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Enter Coupon"
              className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#E07A24]"
            />
            <button
              type="button"
              onClick={() => handleApply()}
              className="px-4 py-2.5 bg-[#E07A24] hover:bg-[#d06b1b] text-white rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-colors shadow-xs"
            >
              Apply coupon
            </button>
          </div>

          {msg && (
            <p className={`text-xs font-bold ${isError ? 'text-rose-600' : 'text-emerald-600'}`}>
              {msg}
            </p>
          )}

          {appliedCoupon && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-between">
              <span>Applied Coupon: {appliedCoupon.code}</span>
              <span className="text-emerald-700">✓ Active</span>
            </div>
          )}

          {/* Eligible promo codes */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-stone-800 block">Eligible promo codes</span>
            <div
              onClick={() => handleApply('MR30')}
              className="p-3 bg-amber-50/40 border-2 border-dashed border-[#E07A24]/60 rounded-2xl cursor-pointer hover:bg-amber-50 transition-colors inline-block min-w-[130px]"
            >
              <div className="text-sm font-black text-stone-900 tracking-wider">MR30</div>
              <div className="text-xs text-stone-600 font-medium mt-0.5">Flat 10% OFF</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    appliedCoupon,
    couponDiscount,
    placeOrder,
    settings,
    setIsTrackingOpen,
    setActiveTrackingOrder
  } = useStore();

  const { lang, t } = useLanguage();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [selectedThana, setSelectedThana] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside-dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isCheckoutOpen) return null;

  // Available Thanas based on selected District
  const currentDistrictObj = BANGLADESH_DISTRICTS.find(d => d.district === selectedDistrict);
  const availableThanas = currentDistrictObj ? currentDistrictObj.thanas : [];

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = e.target.value;
    setSelectedDistrict(dist);
    setSelectedThana('');
    setCity(dist);

    if (dist === 'Dhaka') {
      setDeliveryZone('inside-dhaka');
    } else if (dist === 'Gazipur' || dist === 'Narayanganj') {
      setDeliveryZone('sub-dhaka');
    } else if (dist) {
      setDeliveryZone('outside-dhaka');
    }
  };

  // Delivery calculation
  let deliveryFee = 70;
  if (settings) {
    if (deliveryZone === 'inside-dhaka') deliveryFee = settings.deliveryFeeInsideDhaka;
    else if (deliveryZone === 'sub-dhaka') deliveryFee = settings.deliveryFeeSubDhaka;
    else deliveryFee = settings.deliveryFeeOutsideDhaka;

    if (settings.freeDeliveryThreshold && cartSubtotal >= settings.freeDeliveryThreshold) {
      deliveryFee = 0;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name (আপনার সম্পূর্ণ নাম লিখুন)');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid mobile number (সঠিক মোবাইল নম্বর দিন)');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Please enter house/street/area address (ঠিকানা দিন)');
      return;
    }

    if (!selectedDistrict) {
      setErrorMessage('Please select a District (জেলা নির্বাচন করুন)');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      setErrorMessage('Please enter your bKash/Nagad Transaction ID (TrxID)');
      return;
    }

    setIsSubmitting(true);

    const fullAddressDetails = `${address}${selectedThana ? `, Thana: ${selectedThana}` : ''}, District: ${selectedDistrict}`;

    const result = await placeOrder({
      customerName,
      phone: phone.startsWith('88') ? phone : `88${phone}`,
      altPhone,
      email: email.trim() || undefined,
      deliveryZone,
      address: fullAddressDetails,
      city: selectedDistrict || city,
      orderNotes,
      paymentMethod,
      transactionId: transactionId.trim() || undefined
    });

    setIsSubmitting(false);

    if (result.success && result.order) {
      setCompletedOrder(result.order);
      // Trigger festive confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      setErrorMessage(result.error || 'Failed to place order. Please try again.');
    }
  };

  const handleCopyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleTrackThisOrder = () => {
    if (completedOrder) {
      setActiveTrackingOrder(completedOrder);
      setIsCheckoutOpen(false);
      setIsTrackingOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E6DEC8] overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] border-b border-[#E6DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#16382C] text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#16382C] font-serif">
                {completedOrder ? (lang === 'bn' ? '🎉 অর্ডার সফল হয়েছে!' : '🎉 Order Placed Successfully!') : t('checkout.title')}
              </h2>
              <p className="text-xs text-[#8A5A36] font-semibold">
                {completedOrder ? 'Your pickles are being freshly packed' : 'Cash on Delivery / bKash available across Bangladesh'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmation Screen */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#16382C]">
                {lang === 'bn' ? 'ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে' : 'Thank You for Your Order!'}
              </h3>
              <p className="text-xs sm:text-sm text-[#786655] max-w-md mx-auto">
                {lang === 'bn' 
                  ? 'আমাদের টিম খুব শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবে।'
                  : 'Our representative will call your phone shortly to confirm delivery schedule.'}
              </p>
            </div>

            {/* Order Info Card */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC8] max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-2">
                <span className="text-xs font-bold text-gray-500">Order ID (অর্ডার নম্বর):</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#E07A24]">{completedOrder.id}</span>
                  <button 
                    onClick={handleCopyOrderId}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded"
                    title="Copy ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {isCopied && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Customer Name:</span>
                <span className="font-bold text-[#16382C]">{completedOrder.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Phone:</span>
                <span className="font-bold text-[#16382C]">{completedOrder.phone}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Delivery Zone:</span>
                <span className="font-bold text-[#16382C] capitalize">{completedOrder.deliveryZone.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-[#E6DEC8] pt-2">
                <span className="font-bold text-gray-700">Total Payable:</span>
                <span className="text-base font-extrabold text-[#E07A24]">৳{completedOrder.totalAmount} ({completedOrder.paymentMethod.toUpperCase()})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={handleTrackThisOrder}
                className="flex-1 py-3 px-4 rounded-xl bg-[#16382C] hover:bg-[#1F4D3C] text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-amber-300" />
                <span>{lang === 'bn' ? 'লাইভ অর্ডার ট্র্যাক করুন' : 'Track This Order Live'}</span>
              </button>

              <a
                href={`https://wa.me/8801711234567?text=${encodeURIComponent(
                  `Assalamu Alaikum, I just placed order ${completedOrder.id} for ৳${completedOrder.totalAmount}. Phone: ${completedOrder.phone}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'WhatsApp সাপোর্ট' : 'WhatsApp Support'}</span>
              </a>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* 1. Customer Details & Shipping Address Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-5 bg-[#E07A24] rounded-full inline-block"></span>
                <h3 className="text-base sm:text-lg font-bold text-stone-800 tracking-tight">
                  Shipping Address
                </h3>
              </div>

              {/* Full Name */}
              <div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:border-[#E07A24] focus:ring-1 focus:ring-[#E07A24] placeholder:text-stone-400 transition-all"
                />
              </div>

              {/* Phone Number with Fixed Country Code [ 88 ] */}
              <div className="flex items-center border border-stone-300 rounded-2xl p-1 bg-white focus-within:border-[#E07A24] focus-within:ring-1 focus-within:ring-[#E07A24] transition-all">
                <div className="bg-stone-100 border border-stone-200 text-stone-700 font-bold px-3 py-2 rounded-xl text-xs sm:text-sm shrink-0 select-none">
                  88
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="017********"
                  className="w-full bg-transparent px-2.5 py-1.5 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none placeholder:text-stone-400"
                />
              </div>

              {/* Email Address (Optional) */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@gmail.com (Optional)"
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:border-[#E07A24] focus:ring-1 focus:ring-[#E07A24] placeholder:text-stone-400 transition-all"
                />
              </div>

              {/* House / Street / Area Address */}
              <div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="ex: House no. / building / street / area"
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:border-[#E07A24] focus:ring-1 focus:ring-[#E07A24] placeholder:text-stone-400 transition-all"
                />
              </div>

              {/* District & Thana Select Dropdowns */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="relative">
                  <select
                    required
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="w-full px-3.5 py-3 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium text-stone-700 focus:outline-none focus:border-[#E07A24] focus:ring-1 focus:ring-[#E07A24] appearance-none pr-8 cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {BANGLADESH_DISTRICTS.map(d => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedThana}
                    onChange={e => setSelectedThana(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full px-3.5 py-3 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium text-stone-700 focus:outline-none focus:border-[#E07A24] focus:ring-1 focus:ring-[#E07A24] appearance-none pr-8 cursor-pointer disabled:bg-stone-100 disabled:text-stone-400"
                  >
                    <option value="">Select Thana (Optionally)</option>
                    {availableThanas.map(th => (
                      <option key={th} value={th}>
                        {th}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Billing Address Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#E07A24] rounded-full inline-block"></span>
                <h3 className="text-base sm:text-lg font-bold text-stone-800 tracking-tight">
                  Billing Address
                </h3>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-[#E07A24] flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-[#E07A24] rounded-full"></div>
              </div>
            </div>

            {/* 3. Payment Method Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-5 bg-[#E07A24] rounded-full inline-block"></span>
                <h3 className="text-base sm:text-lg font-bold text-stone-800 tracking-tight">
                  Payment method
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Cash On Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-blue-50/80 border-[#E07A24] text-stone-900 shadow-xs'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">💸</span>
                  <span>Cash On Delivery</span>
                  {paymentMethod === 'cod' && (
                    <div className="w-4 h-4 bg-[#E07A24] text-white rounded-full flex items-center justify-center text-[10px] ml-1">
                      ✓
                    </div>
                  )}
                </button>

                {/* Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'bg-blue-50/80 border-[#E07A24] text-stone-900 shadow-xs'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="p-1 bg-blue-900 text-white rounded-md text-[10px] font-mono">💳</span>
                  <span>Online Payment</span>
                  {paymentMethod === 'nagad' && (
                    <div className="w-4 h-4 bg-[#E07A24] text-white rounded-full flex items-center justify-center text-[10px] ml-1">
                      ✓
                    </div>
                  )}
                </button>

                {/* Bkash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'bg-pink-50 border-[#E07A24] text-stone-900 shadow-xs'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="w-5 h-5 bg-[#D12053] text-white rounded-md flex items-center justify-center font-bold text-[10px]">b</span>
                  <span>Bkash</span>
                  {paymentMethod === 'bkash' && (
                    <div className="w-4 h-4 bg-[#E07A24] text-white rounded-full flex items-center justify-center text-[10px] ml-1">
                      ✓
                    </div>
                  )}
                </button>
              </div>

              {/* bKash/Nagad TrxID Input */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs text-stone-800 space-y-2 animate-in fade-in duration-150 mt-2">
                  <div className="font-bold flex items-center justify-between">
                    <span>{paymentMethod === 'bkash' ? 'bKash Send Money Number:' : 'Nagad Send Money Number:'}</span>
                    <span className="text-[#E07A24] font-mono font-black text-sm">
                      {paymentMethod === 'bkash' ? (settings?.bkashNumber || '01711234567') : (settings?.nagadNumber || '01711234567')}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="Enter Transaction ID (TrxID)"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#E07A24]"
                  />
                </div>
              )}
            </div>

            {/* 4. Have any coupon or gift voucher? Accordion Card */}
            <CouponSection />

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Cart Subtotal ({cart.length} items):</span>
                <span className="font-bold text-stone-900">৳{cartSubtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-৳{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="font-bold text-stone-900">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `৳${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-[#E07A24]">৳{finalTotal}</span>
              </div>
            </div>

            {/* 5. PLACE ORDER Button */}
            <button
              id="submit-order-btn"
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 bg-[#E07A24] hover:bg-[#d06b1b] active:bg-[#c05e13] text-white rounded-2xl font-black text-base sm:text-lg tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>PLACE ORDER</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
