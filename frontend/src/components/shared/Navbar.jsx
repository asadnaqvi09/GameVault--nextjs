"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

import NavbarLogo from "@/components/sections/navbar/navbar_logo";
import NavLinks from "@/components/sections/navbar/navbar_links";
import SocialIcons from "@/components/sections/navbar/navbar_socailIcons";
import SearchBar from "@/components/sections/navbar/navbar_search";
import UserMenu from "@/components/sections/navbar/navbar_user_menu";
import { WishlistButton, CartButton } from "@/components/sections/navbar/navbar_action_buttons";
import GamesDropdown from "@/components/sections/navbar/navbar_games-dropdown";
import MobileHeader from "@/components/sections/navbar/navbar_mobile_header";
import MobileDrawer from "@/components/sections/navbar/navbar_mobile_drawer";
import CartDrawer from "@/components/sections/navbar/navbar_cart_drawer";
import SearchOverlay from "@/components/sections/navbar/navbar_search_overlay";

export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isGamesOpen, setIsGamesOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState("Menu");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const handleLogout = async () => {
        await logout();
        setIsMobileOpen(false);
        setIsDrawerOpen(false);
        router.push("/");
    };
    const mobileMenu = [
        { name: "Home", link: "/" },
        { name: "Games", link: "/games" },
        { name: "Sale", link: "/sale" },
        { name: "About Us", link: "/about-us" },
        { name: "Contact Us", link: "/contact" },
        { name: "Wishlist", link: "/wishlist" },
        ...(!isAuthenticated ? [{ name: "Login/Register", link: "/auth" }] : []),
    ];

    return (
        <>
            <header className="sticky top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
                <MobileHeader
                    onMenuOpen={() => setIsMobileOpen(true)}
                    onCartOpen={() => setIsCartOpen(true)}
                />
                <div className="relative mx-auto hidden lg:flex h-[88px] w-full max-w-[1600px] items-center justify-between px-6 2xl:px-8">
                    <div className="flex items-center gap-6 xl:gap-8 2xl:gap-14 h-full">
                        <NavbarLogo />
                        <NavLinks
                            isGamesOpen={isGamesOpen}
                            onGamesEnter={() => setIsGamesOpen(true)}
                            onGamesLeave={() => setIsGamesOpen(false)}
                        />
                    </div>
                    <div className="flex items-center gap-3 xl:gap-4 2xl:gap-5">
                        <SocialIcons />
                        <SearchBar onOpen={() => setIsSearchOpen(true)} />
                        <div className="hidden xl:block h-8 w-[1px] bg-gray-200" />
                        <div className="flex items-center gap-4 xl:gap-5">
                            <UserMenu
                                user={user}
                                isAuthenticated={isAuthenticated}
                                isDrawerOpen={isDrawerOpen}
                                onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
                                onCloseDrawer={() => setIsDrawerOpen(false)}
                                onLogout={handleLogout}
                            />
                            <WishlistButton count={0} />
                            <CartButton count={0} total="0.00" onOpen={() => setIsCartOpen(true)} />
                        </div>
                    </div>
                    <AnimatePresence>
                        {isGamesOpen && (
                            <GamesDropdown
                                onMouseEnter={() => setIsGamesOpen(true)}
                                onMouseLeave={() => setIsGamesOpen(false)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </header>
            <MobileDrawer
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
                mobileTab={mobileTab}
                onTabChange={setMobileTab}
                mobileMenu={mobileMenu}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}