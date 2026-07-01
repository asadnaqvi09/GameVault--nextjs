import React from 'react'
import Link from 'next/link'
import { CreditCard, Smartphone, Wallet, MapPin } from 'lucide-react'

function Footer() {
    return (
        <footer className="w-full bg-[#f8f9fa] border-t border-gray-200 font-sans">
            <div className="footer-top-bar max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200">
                <div className="payment-methods flex items-center gap-3">
                    <span className="payment-title text-sm font-bold text-gray-800">Payment Methods:</span>
                    <div className="payment-logos flex items-center gap-2">
                        <div className="method-logo px-2 py-1 rounded border border-gray-200 flex items-center justify-center h-7 w-12 gap-1 text-gray-700">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-[10px] font-semibold">COD</span>
                        </div>
                        <div className="method-logo px-2 py-1 rounded border border-gray-200 flex items-center justify-center h-7 w-12 gap-1 text-gray-700">
                            <Smartphone className="w-4 h-4" />
                            <span className="text-[10px] font-semibold">JazzCash</span>
                        </div>
                        <div className="method-logo px-2 py-1 rounded border border-gray-200 flex items-center justify-center h-7 w-12 gap-1 text-gray-700">
                            <Wallet className="w-4 h-4" />
                            <span className="text-[10px] font-semibold">EasyPaisa</span>
                        </div>
                    </div>
                </div>
                <div className="region-selector flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="region-text">Pakistan (English) / PKR</span>
                </div>
            </div>
            <div className="footer-main-content max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div className="brand-info-column flex flex-col gap-4">
                    <div className="brand-logo flex items-center gap-2">
                        <svg className="w-8 h-8 text-[#6042ef]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span className="brand-name text-xl font-bold text-gray-900 tracking-tight">Game<span className="text-[#6042ef]">Vault</span></span>
                    </div>
                    <p className="brand-description text-sm text-gray-500 leading-relaxed">
                        The online store of equipment and electronics is one of the leading online stores. The band was released in 25 volumes.
                    </p>
                </div>
                <div className="links-column flex flex-col gap-4">
                    <h4 className="column-title text-base font-bold text-gray-900">Useful Links</h4>
                    <ul className="links-list flex flex-col gap-2.5 text-sm text-gray-600">
                        <li><Link href="/about-us" className="hover:text-[#6042ef] transition-colors">About Us</Link></li>
                        <li><Link href="/contact-us" className="hover:text-[#6042ef] transition-colors">Contact Us</Link></li>
                        <li><Link href="/games" className="hover:text-[#6042ef] transition-colors">Games</Link></li>
                        <li><Link href="/blogs" className="hover:text-[#6042ef] transition-colors">Blog</Link></li>
                    </ul>
                </div>
                <div className="links-column flex flex-col gap-4">
                    <h4 className="column-title text-base font-bold text-gray-900">Games</h4>
                    <ul className="links-list flex flex-col gap-2.5 text-sm text-gray-600">
                        <li><Link href="/games/pc" className="hover:text-[#6042ef] transition-colors">PC</Link></li>
                        <li><Link href="/games/ps5" className="hover:text-[#6042ef] transition-colors">PlayStation 5</Link></li>
                        <li><Link href="/games/xbox" className="hover:text-[#6042ef] transition-colors">Xbox Series X|S</Link></li>
                    </ul>
                </div>
                <div className="links-column flex flex-col gap-4">
                    <h4 className="column-title text-base font-bold text-gray-900">Social Links</h4>
                    <ul className="links-list flex flex-col gap-2.5 text-sm text-gray-600">
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#6042ef] transition-colors">Instagram</a></li>
                        <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#6042ef] transition-colors">Twitter</a></li>
                        <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#6042ef] transition-colors">YouTube</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom-bar bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-end gap-4 text-xs sm:text-sm text-gray-500 font-medium ">
                    <div className="legal-links flex items-center justify-center gap-4 sm:gap-6">
                        <Link href="/terms" className="hover:text-[#6042ef] transition-colors">Terms Of Service</Link>
                        <Link href="/privacy" className="hover:text-[#6042ef] transition-colors">Privacy Policy</Link>
                        <Link href="/refund-policy" className="hover:text-[#6042ef] transition-colors">Store Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer