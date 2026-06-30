"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCartShopping, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function CartDrawer({ isOpen, onClose, cartItems = [], onRemoveItem, onUpdateQuantity }) {
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
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-[#222]">Shopping cart</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 hover:text-[#222] w-9 h-9 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
                            </button>
                        </div>
                        {isCartEmpty ? (
                            <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
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
                                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-start relative group">
                                            <div className="relative w-20 h-24 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                                                <Image
                                                    src={item.image || '/images/heroBanner2.jpg'}
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
                                                <p className="text-sm text-[#5B42F3] font-bold mt-1">
                                                    PKR {item.price?.toLocaleString()}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 bg-gray-50 border border-gray-100 rounded-md w-fit px-1.5 py-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer"
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} className="text-[9px]" />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-800 px-1 min-w-[16px] text-center">{item.quantity || 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, Math.min(10, (item.quantity || 1) + 1))}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer"
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} className="text-[9px]" />
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onRemoveItem && onRemoveItem(item.id)}
                                                className="absolute right-0 top-1 text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                                aria-label="Remove item"
                                            >
                                                <FontAwesomeIcon icon={faXmark} className="text-[14px]" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 p-6 bg-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-xl font-bold text-gray-900">Subtotal:</span>
                                        <span className="text-2xl font-black text-[#5B42F3]">PKR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="block w-full py-3.5 text-center bg-[#5B42F3] hover:bg-[#4a32d4] text-white font-bold rounded-full transition-all shadow-md shadow-[#5B42F3]/20 hover:shadow-lg text-sm uppercase tracking-wider"
                                    >
                                        Checkout
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
