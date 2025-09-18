// resources/js/Components/Footer.jsx
import React, { useState } from "react";

const Footer = () => {
    const [hoveredSocial, setHoveredSocial] = useState(null);

    const socials = [
        { label: "WhatsApp", icon: "W", tooltip: "Go to WhatsApp", link: "https://wa.me/123456789" },
        { label: "Discord", icon: "D", tooltip: "Go to Discord", link: "https://discord.gg/" },
        { label: "Instagram", icon: "I", tooltip: "Go to Instagram", link: "https://instagram.com/" },
        { label: "YouTube", icon: "Y", tooltip: "Go to YouTube", link: "https://youtube.com/" },
    ];

    const gradients = [
        "from-[#FF2146] to-[#F2AF29]",
        "from-[#F2AF29] to-[#FF2146]",
        "from-[#FF2146] to-[#69747C]",
        "from-[#69747C] to-[#F2AF29]",
    ];

    return (
        <footer className="relative bg-gradient-to-br from-[#0D0C0C] via-[#0D0C0C] to-[#69747C]/20 border-t border-[#69747C]/30">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FF2146]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F2AF29]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            Tournament Portal
                        </h3>
                        <p className="text-[#69747C] leading-relaxed">
                            The ultimate destination for competitive gaming. Join tournaments, connect with players, and dominate the leaderboards.
                        </p>

                        {/* Social Buttons */}
                        <div className="flex space-x-4">
                            {socials.map((social, idx) => (
                                <div key={social.label} className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => window.open(social.link, "_blank")}
                                        className={`w-10 h-10 bg-gradient-to-r ${gradients[idx]} rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer relative`}
                                        onMouseEnter={() => setHoveredSocial(idx)}
                                        onMouseLeave={() => setHoveredSocial(null)}
                                    >
                                        <span className="text-[#F2F2F2] text-sm font-bold">
                                            {social.icon}
                                        </span>
                                    </button>

                                    {/* Tooltip */}
                                    <div
                                        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-200 ${
                                            hoveredSocial === idx
                                                ? "opacity-100 visible translate-y-0"
                                                : "opacity-0 invisible translate-y-2"
                                        }`}
                                    >
                                        <div className="bg-[#0D0C0C] text-[#F2F2F2] text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-[#69747C]/30 whitespace-nowrap">
                                            {social.tooltip}
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0D0C0C]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-[#F2F2F2] font-bold text-lg">Quick Links</h4>
                        <div className="space-y-2">
                            {["Home", "Tournaments", "Leaderboard", "Gallery", "About"].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="block text-[#69747C] hover:text-[#FF2146] transition-colors hover:translate-x-1 transform duration-200"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="text-[#F2F2F2] font-bold text-lg">Support</h4>
                        <div className="space-y-2">
                            {["Help Center", "Contact Us", "Rules & Guidelines", "FAQ", "Report Issue"].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="block text-[#69747C] hover:text-[#FF2146] transition-colors hover:translate-x-1 transform duration-200"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="text-[#F2F2F2] font-bold text-lg">Stay Updated</h4>
                        <p className="text-[#69747C] text-sm">
                            Get the latest tournament news and updates
                        </p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-[#0D0C0C]/50 border border-[#69747C]/50 rounded-lg text-[#F2F2F2] placeholder-[#69747C] focus:border-[#FF2146] focus:outline-none transition-colors"
                            />
                            <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#69747C]/30 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-[#69747C] text-sm">
                            © 2024 Tournament Portal. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-[#69747C] hover:text-[#FF2146] transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-[#69747C] hover:text-[#FF2146] transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-[#69747C] hover:text-[#FF2146] transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-[#FF2146]/10 to-[#F2AF29]/10 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-[#F2AF29]/10 to-[#69747C]/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        </footer>
    );
};

export default Footer;
