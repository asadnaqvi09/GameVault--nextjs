"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function CartDrawer({ isOpen, onClose }) {
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
                            <h2 className="text-xl font-bold text-[#222]">Shopping Cart</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 hover:text-[#222] w-9 h-9 flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                <FontAwesomeIcon icon={faCartShopping} className="text-[36px]" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-[#222]">Your cart is empty</h3>
                            <p className="text-sm text-gray-400 max-w-[260px]">
                                Looks like you haven't added any awesome games to your collection yet.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}