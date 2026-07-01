"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/context/ToastContext";
import { placeCodOrder } from "@/lib/api/orderApi";
import { submitManualPayment } from "@/lib/api/paymentApi";

const jazzcashNumber = process.env.NEXT_PUBLIC_JAZZCASH_NUMBER || "";
const easypaisaNumber = process.env.NEXT_PUBLIC_EASYPAISA_NUMBER || "";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, accessToken } = useAuth();
  const { cartItems, updateQuantity, clearCart } = useCart();
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    streetAddress: "",
    zipCode: "",
    orderNotes: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.email) {
      setBillingInfo((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const total = subtotal;
  const isManual = paymentMethod === "jazzcash" || paymentMethod === "easypaisa";

  const buildPayload = () => ({
    billingDetails: billingInfo,
    items: cartItems.map((item) => ({
      gameId: item.gameId,
      quantity: item.quantity || 1,
      platform: item.platform || null,
      edition: item.edition || null,
    })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }
    if (isManual) {
      if (!transactionId.trim()) {
        showToast("Transaction ID is required", "error");
        return;
      }
      if (!proofFile) {
        showToast("Payment screenshot is required", "error");
        return;
      }
    }
    setIsSubmitting(true);
    try {
      if (paymentMethod === "cod") {
        await placeCodOrder(buildPayload());
        await clearCart();
        showToast("Order placed — we will confirm on delivery");
      } else {
        const formData = new FormData();
        formData.append("billingDetails", JSON.stringify(billingInfo));
        formData.append("items", JSON.stringify(buildPayload().items));
        formData.append("paymentMethod", paymentMethod);
        formData.append("transactionId", transactionId.trim());
        if (senderNumber.trim()) formData.append("senderNumber", senderNumber.trim());
        formData.append("proofImage", proofFile);
        await submitManualPayment(formData, accessToken);
        await clearCart();
        showToast("Payment under review — track status in your profile");
      }
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        showToast(err.message || "This transaction ID was already used", "error");
      } else if (status === 503) {
        showToast("Payment upload is temporarily unavailable. Please try again.", "error");
      } else {
        showToast(err.message || "Failed to place order", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center text-gray-400">
        Loading checkout...
      </div>
    );
  }

  return (
    <div id="checkout-root-wrapper" className="w-full max-w-[1400px] mx-auto px-4 py-6 md:py-10 select-none">
      <nav id="checkout-breadcrumbs" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-8 md:mb-12">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/games" className="hover:text-gray-900 transition-colors">Game Collection</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900">Checkout</span>
      </nav>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div id="checkout-left-column" className="lg:col-span-7 flex flex-col gap-10">
          <div id="billing-details-section" className="flex flex-col gap-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight pb-3 border-b border-gray-100">Billing details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">First name <span className="text-red-500">*</span></label>
                <input type="text" name="firstName" required value={billingInfo.firstName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Last name <span className="text-red-500">*</span></label>
                <input type="text" name="lastName" required value={billingInfo.lastName} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" required value={billingInfo.phone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email address <span className="text-red-500">*</span></label>
                <input type="email" name="email" required value={billingInfo.email} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Province <span className="text-red-500">*</span></label>
                <input type="text" name="province" required value={billingInfo.province} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">City <span className="text-red-500">*</span></label>
                <input type="text" name="city" required value={billingInfo.city} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Zip code <span className="text-red-500">*</span></label>
                <input type="text" name="zipCode" required value={billingInfo.zipCode} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Street address <span className="text-red-500">*</span></label>
              <input type="text" name="streetAddress" required placeholder="House number and street name" value={billingInfo.streetAddress} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Order notes (optional)</label>
              <textarea name="orderNotes" rows="4" placeholder="Notes about your order." value={billingInfo.orderNotes} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] transition-colors bg-gray-50/30 resize-none" />
            </div>
          </div>
          <div id="payment-information-section" className="flex flex-col gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-2">Payment information</h2>
            {[
              { id: "cod", label: "Cash on Delivery" },
              { id: "jazzcash", label: "JazzCash" },
              { id: "easypaisa", label: "EasyPaisa" },
            ].map((method) => (
              <div key={method.id} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <input
                  type="radio"
                  id={method.id}
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="w-4 h-4 text-[#5B42F3] focus:ring-[#5B42F3]"
                />
                <label htmlFor={method.id} className="text-sm font-bold text-gray-800 cursor-pointer">{method.label}</label>
              </div>
            ))}
            {paymentMethod === "cod" && (
              <p className="text-xs text-gray-400 pl-7 leading-relaxed">Pay with cash upon delivery of your game keys.</p>
            )}
            {paymentMethod === "jazzcash" && (
              <div className="flex flex-col gap-3 pl-1">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                  <p className="font-bold mb-1">Send exactly PKR {total.toLocaleString()} to:</p>
                  <p className="font-mono text-[#5B42F3]">{jazzcashNumber}</p>
                  <p className="text-xs text-gray-400 mt-2">Include your name in the payment note.</p>
                </div>
                <input type="text" placeholder="Transaction ID *" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] bg-white" />
                <input type="tel" placeholder="Sender mobile number (optional)" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] bg-white" />
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setProofFile(e.target.files?.[0] || null)} className="text-sm text-gray-600" />
              </div>
            )}
            {paymentMethod === "easypaisa" && (
              <div className="flex flex-col gap-3 pl-1">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                  <p className="font-bold mb-1">Send exactly PKR {total.toLocaleString()} to:</p>
                  <p className="font-mono text-[#5B42F3]">{easypaisaNumber}</p>
                  <p className="text-xs text-gray-400 mt-2">Include your name in the payment note.</p>
                </div>
                <input type="text" placeholder="Transaction ID *" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] bg-white" />
                <input type="tel" placeholder="Sender mobile number (optional)" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] bg-white" />
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setProofFile(e.target.files?.[0] || null)} className="text-sm text-gray-600" />
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-4 bg-[#5B42F3] hover:bg-[#4a32d4] disabled:opacity-60 text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#5B42F3]/20 hover:shadow-lg"
            >
              {isSubmitting ? "Placing order..." : "Place order"}
            </motion.button>
          </div>
        </div>
        <div id="checkout-right-column" className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-xs sticky top-8">
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 pb-4 border-b border-gray-100">Your order</h2>
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Your cart is empty.</p>
          ) : (
            <>
              <div className="flex flex-col gap-5 max-h-[360px] overflow-y-auto pr-2 mb-6">
                {cartItems.map((item, index) => (
                  <div key={item.id || index} className="flex gap-4 items-center justify-between pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="relative w-14 h-16 rounded-md overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-snug truncate max-w-[180px] sm:max-w-[240px] md:max-w-[300px]">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5 bg-gray-50 border border-gray-100 rounded-md w-fit px-1.5 py-0.5">
                          <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))} className="text-gray-400 hover:text-gray-900 text-xs px-1 font-bold cursor-pointer">-</button>
                          <span className="text-xs font-bold text-gray-800 px-1 min-w-[12px] text-center">{item.quantity || 1}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, Math.min(10, (item.quantity || 1) + 1))} className="text-gray-400 hover:text-gray-900 text-xs px-1 font-bold cursor-pointer">+</button>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900 shrink-0">PKR {(item.price * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-500">Shipping</span>
                  <span className="font-bold text-emerald-600">Free</span>
                </div>
                <div className="h-px bg-gray-200/60 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-[#5B42F3]">PKR {total.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
