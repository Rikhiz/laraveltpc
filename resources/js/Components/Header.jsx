import React, { useState } from "react";
import { Menu } from "lucide-react";
import logo from "../images/test.png";
import { router } from "@inertiajs/react";
import LoginModal from "@/Components/LoginModal";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navLinks = [
    { label: "LEADERBOARD", href: "/leaderboards" },
    { label: "TOURNAMENTS", href: "/tournaments" },
    { label: "GALLERY", href: "/gallery" },
    { label: "ABOUT", href: "/about" },
  ];

  const handleNavigation = (href) => {
    router.visit(href);
  };

  return (
    <>
      <nav className="bg-zinc-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavigation("/")}
              className="text-white hover:text-red-500 transition-colors"
            >
              <img src={logo} alt="Logo" className="size-20" />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className="text-xl text-white hover:text-red-500 transition-colors font-sans"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Sign In */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="hidden md:block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Sign In
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 border-t border-gray-700">
            <div className="px-4 py-2 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    handleNavigation(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-white hover:text-red-500 transition-colors font-sans text-lg py-2 border-b border-gray-700"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors mt-4"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Reusable Login Modal */}
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Header;
