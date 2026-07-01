"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faTiktok, faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

const socials = [
    { id: 1, icon: faInstagram, hover: "hover:bg-pink-500", to: "https://www.facebook.com/profile.php?id=100094578753986" },
    { id: 2, icon: faYoutube, hover: "hover:bg-red-500", to: "https://www.facebook.com/profile.php?id=100094578753986" },
    { id: 3, icon: faTiktok, hover: "hover:bg-black", to: "https://www.facebook.com/profile.php?id=100094578753986" },
    { id: 4, icon: faTwitter, hover: "hover:bg-sky-500", to: "https://www.facebook.com/profile.php?id=100094578753986" },
];

export default function SocialIcons() {
    return (
        <div className="flex items-center gap-2">
            {socials.map((item) => (
                <div
                    key={item.id}
                    className={`flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-all duration-200 hover:text-white ${item.hover}`}
                    onClick={() => window.open(item.to, '_blank')}
                >
                    <FontAwesomeIcon icon={item.icon} className="text-[16px]" />
                </div>
            ))}
        </div>
    );
}