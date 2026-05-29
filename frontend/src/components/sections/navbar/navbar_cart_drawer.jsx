"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function CartDrawer({ isOpen, onClose, cartItems = [], onRemoveItem }) {
    const isCartEmpty = cartItems.length === 0;
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                        className="fixed right-0 top-0 z-[100] h-screen w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
                    >
                        <div id="cart-drawer-header" className="flex items-center justify-between border-b border-gray-100 p-6">
                            <h2 id="cart-drawer-title" className="text-xl font-bold text-[#222]">Shopping cart</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 hover:text-[#222] w-9 h-9 flex items-center justify-center transition-colors"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
                            </button>
                        </div>
                        {isCartEmpty ? (
                            <div id="cart-empty-state" className="flex-1 flex flex-col items-center justify-center px-10 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                    <FontAwesomeIcon icon={faCartShopping} className="text-[36px]" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-[#222]">Your cart is empty</h3>
                                <p className="text-sm text-gray-400 max-w-[260px]">
                                    Looks like you haven't added any awesome games to your collection yet.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div id="cart-items-list" className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                                    {cartItems.map((item, index) => (
                                        <div key={item.id || index} id={`cart-item-${index}`} className="flex gap-4 items-start relative group">
                                            <div className="relative w-20 h-24 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-6 pt-1">
                                                <h4 className="text-[15px] font-bold text-gray-900 leading-snug break-words">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm text-gray-400 mt-1 font-medium">
                                                    {item.quantity || 1} <span className="text-gray-300 mx-1">×</span> <span className="text-[#5B42F3] font-bold">${item.price}</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => onRemoveItem && onRemoveItem(item.id)}
                                                className="absolute right-0 top-1 text-gray-400 hover:text-red-500 p-1 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <FontAwesomeIcon icon={faXmark} className="text-[14px]" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div id="cart-drawer-footer" className="border-t border-gray-100 p-6 bg-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-xl font-bold text-gray-900">Subtotal:</span>
                                        <span className="text-2xl font-black text-[#5B42F3]">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/cart"
                                            onClick={onClose}
                                            className="w-full py-3.5 text-center bg-[#eae8fe] hover:bg-[#dfdbfe] text-[#5B42F3] font-bold rounded-full transition-colors text-sm uppercase tracking-wider"
                                        >
                                            View Cart
                                        </Link>
                                        <Link
                                            href="/checkout"
                                            onClick={onClose}
                                            className="w-full py-3.5 text-center bg-[#5B42F3] hover:bg-[#4a32d4] text-white font-bold rounded-full transition-all shadow-md shadow-[#5B42F3]/20 hover:shadow-lg text-sm uppercase tracking-wider"
                                        >
                                            Checkout
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}